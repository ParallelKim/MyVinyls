import { Group } from "three";
import { proxy } from "valtio";

export const refState = proxy<{
    root: React.Ref<Group>;
}>({
    root: null,
});

export const setRoot = (root: React.Ref<Group>) => {
    refState.root = root;
};
