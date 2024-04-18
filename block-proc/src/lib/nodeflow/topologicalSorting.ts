import { NodeConstructor } from "./Node.vue"
import { ConnectionConstructor } from './Connection.vue'


export interface ITopologicalSortingResult {
    calculationOrder: NodeConstructor[];
    connectionsFromNode: Map<NodeConstructor, ConnectionConstructor[]>;
    /** NodeInterface.id -> parent Node.id */
    interfaceIdToNodeId: Map<string, string>;
}

export class CycleError extends Error {
    public constructor() {
        super("Cycle detected");
    }
}

function isString(v: string | undefined): v is string {
    return typeof v === "string";
}

/** Uses Kahn's algorithm to topologically sort the nodes in the graph */
export function sortTopologically(
    pNodes: ReadonlyArray<NodeConstructor>,
    pConnections?: ReadonlyArray<ConnectionConstructor>,
): ITopologicalSortingResult {
    /** NodeInterface.id -> parent Node.id */
    const interfaceIdToNodeId = new Map<string, string>();

    /** Node.id -> set of connected node.id */
    const adjacency = new Map<string, Set<string>>();
    const connectionsFromNode = new Map<NodeConstructor, ConnectionConstructor[]>();

    let nodes: ReadonlyArray<NodeConstructor>;
    let connections: ReadonlyArray<ConnectionConstructor>;

    if (!pConnections) {
        throw new Error("Invalid argument value: expected array of connections");
    }
    nodes = pNodes;
    connections = pConnections;

    nodes.forEach((n) => {
        Object.values(n.inputs).forEach((intf) => interfaceIdToNodeId.set(intf.id, n.id));
        Object.values(n.outputs).forEach((intf) => interfaceIdToNodeId.set(intf.id, n.id));
    });

    // build adjacency list
    nodes.forEach((n) => {
        const connectionsFromCurrentNode = connections.filter(
            (c) => c.outputId && interfaceIdToNodeId.get(c.outputId) === n.id,
        );
        const adjacentNodes = new Set<string>(
            connectionsFromCurrentNode.map((c) => interfaceIdToNodeId.get(c.inputId)).filter(isString),
        );
        adjacency.set(n.id, adjacentNodes);
        connectionsFromNode.set(n, connectionsFromCurrentNode);
    });

    // startNodes are all nodes that don't have any input connected
    const startNodes = nodes.slice();
    connections.forEach((c) => {
        const index = startNodes.findIndex((n) => interfaceIdToNodeId.get(c.inputId) === n.id);
        if (index >= 0) {
            startNodes.splice(index, 1);
        }
    });

    const sorted: NodeConstructor[] = [];

    while (startNodes.length > 0) {
        const n = startNodes.pop()!;
        sorted.push(n);
        const nodesConnectedFromN = adjacency.get(n.id)!;
        while (nodesConnectedFromN.size > 0) {
            const mId: string = nodesConnectedFromN.values().next().value;
            nodesConnectedFromN.delete(mId);
            if (Array.from(adjacency.values()).every((connectedNodes) => !connectedNodes.has(mId))) {
                const m = nodes.find((node) => node.id === mId)!;
                startNodes.push(m);
            }
        }
    }

    if (Array.from(adjacency.values()).some((c) => c.size > 0)) {
        throw new CycleError();
    }

    return {
        calculationOrder: sorted,
        connectionsFromNode,
        interfaceIdToNodeId,
    };
}

/** Checks whether the provided set of nodes and connections contains a cycle */
export function containsCycle(
    nodes: ReadonlyArray<NodeConstructor>,
    connections?: ReadonlyArray<ConnectionConstructor>,
): boolean {
    try {
        sortTopologically(nodes, connections);
        return false;
    } catch (err) {
        if (err instanceof CycleError) {
            return true;
        }
        throw err;
    }
}
