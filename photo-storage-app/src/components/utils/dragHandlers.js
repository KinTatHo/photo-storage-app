import { arrayMove } from "@dnd-kit/sortable";
import { writeBatch, doc } from "firebase/firestore";
import { db } from "../../firebase/config";

export const handleDragEnd = async (event, photos, setPhotos) => {
  const { active, over } = event;

  if (active.id !== over.id) {
    setPhotos((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });

    try {
      const batch = writeBatch(db);
      photos.forEach((photo, index) => {
        const docRef = doc(db, "photos", photo.id);
        batch.update(docRef, { order: index });
      });
      await batch.commit();
    } catch (error) {
      console.error("Error updating photo order:", error);
    }
  }
};