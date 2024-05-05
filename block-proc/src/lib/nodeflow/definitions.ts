import { Ref, ref } from 'vue';
import { fast_uuid } from './uuid';


export type RootMap = Map<string, BaseConstructor>;


export class BaseConstructor {
    root?: RootMap;
    id: Ref<string> & string;
    nodeId: string;

    constructor(root?: RootMap) {
        this.id = ref(fast_uuid()) as Ref<string> & string;
        if (root) {
            this.setNodeflow(root);
        }
        this.nodeId = '';
    }

    setNodeflow(root: RootMap) {
        this.root = root;
        root.set(this.id.value, this);
    }

    getId(): string {
        if (this.id) {
            return this.id.value
        }
        return '';
    }

    getById(id: string): BaseConstructor | undefined {
        if (this.root && id) {
            return this.root.get(id);
        }
        return undefined;
    }
    
    public resetIdentity() {
        this.id = ref(fast_uuid()) as Ref<string> & string;
        if (this.root) {
            this.setNodeflow(this.root)
        }
    }
    
    public toJSON(): Object {
        return {
            id: String(this.id),
            nodeId: this.nodeId
        };
    }
    
    public static fromJSON(d: Object, base: BaseConstructor): BaseConstructor | undefined {
        base.id.value = d['id'] as Ref<string> & string;
        base.nodeId = d['nodeId'];
        return base;
    }
}