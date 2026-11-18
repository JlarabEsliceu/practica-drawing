function createHistory(state) {
    const undos = [];
    const redos = [];

    return {
        execute(action) {
            action.do(state);
            undos.push(action);
            redos.length = 0;
        },

        undo() {
            const a = undos.pop();
            if (!a) return;
            a.undo(state);
            redos.push(a);
        },

        redo() {
            const a = redos.pop();
            if (!a) return;
            a.do(state);
            undos.push(a);
        },

        canUndo: () => undos.length > 0,
        canRedo: () => redos.length > 0,
    };
}
