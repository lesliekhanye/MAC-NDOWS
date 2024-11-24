import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const createFolder = async (req, res) => {
  try {
    const { userId } = req.session; // Assume session contains the logged-in user's ID

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const folder = await prisma.folder.create({
      data: {
        name: 'New Folder', // Default name
        userId,
      },
    });

    res.status(201).json({ folder });
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ error: 'Failed to create folder' });
  }
};
