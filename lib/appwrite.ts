import { 
    Client,
    Avatars,
    Databases,
    Account,
    ID,
    Query,
    Storage,
    Functions 
} from "react-native-appwrite";

const client = new Client();
const databases = new Databases(client);
const avatars = new Avatars(client);
const account = new Account(client);
const storage = new Storage(client);
const functions = new Functions(client);

export { account, functions, storage, databases, avatars, client, ID, Query };

client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("66bb50ba003a365f917d")

export async function getRestaurants() {
    try{
        let res = await databases.listDocuments(
            "669a5a3d003d47ff98c7",
            "672b2eec001fae2377d9",
        );
        // console.log("RESPONSE:", res);
        return res.documents;
    }catch(error) {
        console.error('Failed to fetch Restaurants:', error);
        throw error;
    }
};

export async function getRestaurant(id: string) {
    try{
        let res = await databases.listDocuments(
            "669a5a3d003d47ff98c7",
            "672b2eec001fae2377d9",
            [
                Query.equal('$id', id)
            ]
        );
        return res.documents;
    }catch(error) {
        console.error('Failed to fetch Restaurant:', error);
        throw error;
    }
}

export async function getDishes(id: string) {
    try{
        let res = await databases.listDocuments(
            "669a5a3d003d47ff98c7",
            "672b60f200023ce98be2",
            [
                Query.equal("restaurants", id)
            ]
        ); 
        return res.documents;
    }catch(error) {
        console.error('Failed to fetch Dishes:', error);
        throw error;
    }
}

export async function getDish(id) {
    try {
        let res = await databases.listDocuments(
            "669a5a3d003d47ff98c7",
            "672b60f200023ce98be2",
            [
                Query.equal('$id', id)
            ]
        );
        // console.log('RESPONSE:', res);
        const data = res.documents;

        // Ensure that requiredExtras and optionalExtras are parsed if they exist
        if (data.length > 0) {
            const dish = data[0]; // Only need the first item as a single object
            
            dish.requiredExtras = dish.requiredExtras
                ? JSON.parse(dish.requiredExtras)
                : []; // Default to an empty array if undefined

            dish.optionalExtras = dish.optionalExtras
                ? JSON.parse(dish.optionalExtras)
                : []; // Default to an empty array if undefined

            return dish; // Return the single dish object directly
        } else {
            return null;
        }
    } catch (error) {
        console.error('Failed to fetch Dish:', error);
        throw error;
    }
}
