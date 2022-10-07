import TroopsController from "./controller/controller";
import { validateOrReject } from 'class-validator'

const myArgs = process.argv.slice(2);

let size;
if (myArgs.length) {
    size = Number(myArgs[0])
} else {
    size = 167
}

export const handler = async (size) => {
    let controller = new TroopsController(size)

    try {
        await validateOrReject(controller);
        return controller.generateTroops();
    } catch (errors) {
        console.error('Validation failed with errors: ', errors);
    }

}

(async function(){
    console.log(await handler(size));
})()



