export const getParentResource = () => {
    if (!(window as any).GetParentResourceName) {
        return "fd_prp_groups";
    }
    return (window as any).GetParentResourceName();
};
