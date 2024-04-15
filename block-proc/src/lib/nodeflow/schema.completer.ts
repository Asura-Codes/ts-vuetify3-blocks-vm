// objects containing arrays containing objects etc.
function fillMissingKeys(
    incompleteOriginal: Object,
    schema: Object,
    path = ""
): Object {
    let incomplete = incompleteOriginal;

    if (typeof schema === 'object' && typeof incomplete === 'object') {
        // traverse the keys on schema and add them onto incomplete
        Object.keys(schema).forEach((key) => {
            // calculate the path for current key
            let currentPath = `${path ? `${path}.` : ""}${key}`;

            if ( incomplete[key] === undefined || incomplete[key] === null ) {
                incomplete[key] = JSON.parse(JSON.stringify(schema[key]));
            } else {
                fillMissingKeys(
                    incomplete[key] as Object,
                    schema[key] as Object,
                    currentPath,
                );
            }
        });


    } else if (Array.isArray(schema) && Array.isArray(incomplete)) {
        if (schema.length) {
            for (let i = incomplete.length; i--;) {
                let currentPath = `${path ? `${path}.` : ""}0`;

                if (typeof schema[0] === 'object' || Array.isArray(schema[0])) {
                    incomplete[i] = fillMissingKeys(
                        incomplete[i],
                        schema[0] as Object,
                        currentPath,
                    );
                }
            }
        }
    } else {
        // Probably existing simple type
    }

    return incomplete;
}

// =================================================
// T H E   E X P O S E D   F U N C T I O N

export function fillMissing(incomplete: Object, schema: Object): Object {
    // first argument must be an object. However, we're going to call recursively,
    // so we have to wrap the main function with another, wrapper-one, and perform
    // object-checks only on that wrapper. This way, only objects can come in,
    // but inside there can be whatever data structures.

    if (arguments.length === 0) {
        throw new Error(
            "All arguments are missing!",
        );
    }
    if (!(typeof incomplete === 'object')) {
        throw new Error(
            `First argument, input object must be a plain object. Currently it's type is "${typeof incomplete}" and it's equal to: ${JSON.stringify(incomplete, null, 4)}`,
        );
    }
    if (!(typeof schema === 'object')) {
        throw new Error(
            `Second argument, schema object, must be a plain object. Currently it's type is "${typeof schema}" and it's equal to: ${JSON.stringify(schema, null, 4)}`,
        );
    }

    return fillMissingKeys(incomplete, schema);
}