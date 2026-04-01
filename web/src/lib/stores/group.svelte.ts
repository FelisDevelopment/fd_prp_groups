import { getContext, setContext } from "svelte";
import type {
    GroupData,
    Member,
    Leader,
    Activity,
    PartyStatus,
    NearbyPlayer,
    TabId,
} from "../../types/group.types";
import { isDevelopment } from "../utils/isDevelopment";
import { MockedGroupData, MockedNearbyPlayers } from "../../mocks/group.mock";
import { useNuiEvent } from "../composables/useNuiEvent";
import { useApi } from "../composables/useApi";

class GroupStore {
    #inGroup: boolean = $state(isDevelopment);
    #members: Member[] = $state(isDevelopment ? MockedGroupData.members : []);
    #leader: Leader | null = $state(isDevelopment ? MockedGroupData.leader : null);
    #activity: Activity | null = $state(isDevelopment ? MockedGroupData.activity : null);
    #isInviting: boolean = $state(isDevelopment ? MockedGroupData.isInviting : false);
    #isLocked: boolean = $state(isDevelopment ? MockedGroupData.isLocked : false);
    #partyStatus: PartyStatus | null = $state(isDevelopment ? MockedGroupData.partyStatus : null);
    #nearbyPlayers: NearbyPlayer[] = $state(isDevelopment ? MockedNearbyPlayers : []);
    #pendingInvites: Set<number | string> = $state(new Set());
    #activeTab: TabId = $state("members");
    #isLeader: boolean = $state(isDevelopment);

    constructor() {
        this.setupEvents();
    }

    get inGroup() { return this.#inGroup; }
    get members() { return this.#members; }
    get leader() { return this.#leader; }
    get activity() { return this.#activity; }
    get isInviting() { return this.#isInviting; }
    get isLocked() { return this.#isLocked; }
    get partyStatus() { return this.#partyStatus; }
    get nearbyPlayers() { return this.#nearbyPlayers; }
    get pendingInvites() { return this.#pendingInvites; }
    get activeTab() { return this.#activeTab; }
    get isLeader() { return this.#isLeader; }

    get onlineCount() {
        return this.#members.filter((m) => m.online).length;
    }

    get memberCount() {
        return this.#members.length;
    }

    changeTab = (tab: TabId) => {
        this.#activeTab = tab;
    };

    private setupEvents = () => {
        useNuiEvent<GroupData | null>("group:data", (data) => {
            if (!data) {
                this.resetState();
                return;
            }
            this.populateFromData(data);
        });

        useNuiEvent("group:disbanded", () => {
            this.resetState();
        });
    };

    private resetState = () => {
        this.#inGroup = false;
        this.#members = [];
        this.#leader = null;
        this.#activity = null;
        this.#isInviting = false;
        this.#isLocked = false;
        this.#partyStatus = null;
        this.#nearbyPlayers = [];
        this.#pendingInvites = new Set();
        this.#activeTab = "members";
        this.#isLeader = false;
    };

    private populateFromData = (data: GroupData) => {
        this.#inGroup = true;
        this.#members = data.members;
        this.#leader = data.leader;
        this.#activity = data.activity;
        this.#isInviting = data.isInviting;
        this.#isLocked = data.isLocked;
        this.#partyStatus = data.partyStatus;
        this.#isLeader = data.isLeader;

        // Clear pending invites for players who are now members
        if (this.#pendingInvites.size > 0) {
            const memberSrcs = new Set(data.members.map((m) => String(m.src)));
            const remaining = new Set<number | string>();
            for (const src of this.#pendingInvites) {
                if (!memberSrcs.has(String(src))) {
                    remaining.add(src);
                }
            }
            this.#pendingInvites = remaining;
        }
    };

    createGroup = async () => {
        const { data } = await useApi<{ success: boolean; data?: GroupData; error?: string }>("createGroup");
        if (data?.success && data.data) {
            this.populateFromData(data.data);
        }
        return data;
    };

    leave = async () => {
        const { data } = await useApi<{ success: boolean }>("leave");
        if (data?.success) this.resetState();
        return data;
    };

    kick = async (targetSrc: number | string) => {
        const { data } = await useApi<{ success: boolean }>("kick", { targetSrc });
        if (data?.success) {
            this.#members = this.#members.filter((m) => String(m.src) !== String(targetSrc));
        }
        return data;
    };

    toggleInviting = async () => {
        const { data } = await useApi<{ success: boolean; isInviting: boolean }>("toggleInviting");
        if (data?.success) this.#isInviting = data.isInviting;
        return data;
    };

    toggleLocked = async (locked: boolean) => {
        const { data } = await useApi<{ success: boolean; isLocked: boolean }>("toggleLocked", { locked });
        if (data?.success) this.#isLocked = data.isLocked;
        return data;
    };

    invite = async (targetSrc: number | string) => {
        this.#pendingInvites = new Set([...this.#pendingInvites, targetSrc]);
        const { data } = await useApi<{ success: boolean }>("invite", { targetSrc });
        if (!data?.success) {
            const next = new Set(this.#pendingInvites);
            next.delete(targetSrc);
            this.#pendingInvites = next;
        }
        return data;
    };

    refreshNearby = async () => {
        const { data } = await useApi<NearbyPlayer[]>("getNearbyPlayers", undefined, {
            mockData: isDevelopment ? MockedNearbyPlayers : undefined,
        });
        if (data) this.#nearbyPlayers = data;
    };

    refreshPartyStatus = async () => {
        const { data } = await useApi<PartyStatus | null>("getPartyStatus");
        if (data !== undefined) this.#partyStatus = data;
    };
}

export const useGroup = () => setContext("group", new GroupStore());
export const getGroup = () => getContext<GroupStore>("group");
