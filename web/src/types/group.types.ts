export interface Member {
    identifier: string;
    src: number | string;
    characterName: string;
    online: boolean;
    isLeader: boolean;
}

export interface Leader {
    identifier: string;
    src: number | string;
    characterName: string;
}

export interface Activity {
    activityId: string;
    activityName: string;
}

export interface PartyStatus {
    active: boolean;
    partyUuid?: string | null;
    queueName?: string | null;
    position?: number | null;
}

export interface NearbyPlayer {
    src: number | string;
    characterName: string;
    distance: number;
    inGroup: boolean;
}

export interface GroupData {
    uuid: string;
    members: Member[];
    leader: Leader;
    isLeader: boolean;
    activity: Activity | null;
    isInviting: boolean;
    isLocked: boolean;
    partyStatus: PartyStatus | null;
}

export type TabId = "members" | "invite" | "activity" | "settings";
