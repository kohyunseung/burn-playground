import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";

export const initialProfile = async () => {
  const current = await currentUser();

  if (!current) {
    return redirectToSignIn();
  }

  const user = await db.user.findUnique({
    where: {
      userId: current.id,
    },
  });

  if (user) {
    return user;
  }

  const newUser = await db.user.create({
    data: {
      userId: current.id,
      name: `${current.lastName} ${current.firstName}`,
      imageUrl: current.imageUrl,
      email: current.emailAddresses[0].emailAddress,
    },
  });

  return newUser;
};
