import bcrypt from "bcrypt";
import { Role, User, ActivityLog, Member } from "../app/models/index.mjs";
import logUserActivity from "../utils/logUserActivity.mjs";
import { faker } from "@faker-js/faker";

const NUM_USERS = 50;

export function createRandomUser(roleId, hashedPassword) {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: hashedPassword,
    roleId,
  };
}

export function createRandomMember(userId) {
  return {
    dateOfBirth: faker.date.birthdate({ min: 18, max: 60, mode: "age" }),
    profilePicture: faker.image.avatar(),
    userId,
  };
}

async function seedUsers() {
  try {
    // Fetch roles and ensure the "register" activity exists
    const seededRoles = await Role.findAll();
    const registerActivity = await ActivityLog.findOne({
      where: { action: "register" },
    });

    if (!registerActivity) {
      throw new Error('Activity "register" not found in ActivityLog table.');
    }

    const userRole = seededRoles.find((role) => role.name === "user");
    const adminRole = seededRoles.find((role) => role.name === "admin");

    if (!userRole || !adminRole) {
      throw new Error("Required roles (user/admin) are missing.");
    }

    // Generate passwords and their hashes
    const passwords = Array(NUM_USERS)
      .fill()
      .map(() => "password");
    const hashedPasswords = await Promise.all(
      passwords.map((password) => bcrypt.hash(password, 10))
    );

    // Generate random users
    const users = hashedPasswords.map((hashedPassword, index) =>
      createRandomUser(index === 0 ? adminRole.id : userRole.id, hashedPassword)
    );

    // Bulk create users and fetch them
    await User.sync({});
    const createdUsers = await User.bulkCreate(users, { returning: true });

    // Log the registration activity for each user
    for (const user of createdUsers) {
      await logUserActivity(user.id, "register");
    }

    // Generate and bulk create members
    const members = createdUsers.map((user) => createRandomMember(user.id));
    await Member.bulkCreate(members);

    // Log the member creation activity for each user - action: "create", description: "User created Member"
    const createMemberActivity = await ActivityLog.findOne({
      where: { action: "create-member" },
    });

    if (!createMemberActivity) {
      throw new Error(
        'Activity "create" with description "User created Member" not found in ActivityLog table.'
      );
    }

    for (const user of createdUsers) {
      await logUserActivity(user.id, "create-member");
    }

    console.log(
      "Roles, users, members, and UserActivity seed data inserted successfully!"
    );
  } catch (error) {
    console.error("Error seeding users and members:", error);
  }
}

seedUsers().then(() => process.exit());

export default seedUsers;
