import {adapty} from "react-native-adapty";
import AdaptyConstents from "./AdaptyConstents";

export const activationPromise= ( async () => {
    try{
        await adapty.activate (AdaptyConstants.API_KEY);
    } catch(error){
        console.error("Adapty activation failed:",error);
    }


} )();