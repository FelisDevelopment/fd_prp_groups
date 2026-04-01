local config = require 'config.general'

local function generateUUID()
    local template = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
    return template:gsub("[xy]", function(c)
        local v = (c == "x") and math.random(0, 15) or math.random(8, 11)
        return string.format("%x", v)
    end)
end

---@param source number
---@return table | nil
local function getGroupData(source)
    local group = exports['prp-bridge']:GetGroupFromMember(source)
    if not group then return nil end

    local members = group.getMembers()
    local leader = group.getLeader()
    local activity = group.getActivity()
    local partyUuid = group.getPartyUuid()

    local memberList = {}
    for _, member in pairs(members) do
        memberList[#memberList + 1] = {
            identifier = member.identifier,
            src = member.src,
            characterName = member.characterName,
            online = member.online,
            isLeader = member.isLeader,
        }
    end

    return {
        uuid = group.getUuid(),
        members = memberList,
        leader = leader,
        isLeader = group.isSrcALeader(source),
        activity = activity,
        isInviting = group.isInviting(),
        isLocked = group.isLocked(),
        partyStatus = partyUuid and {
            active = true,
            partyUuid = partyUuid,
        } or nil,
    }
end

lib.callback.register('fd_prp_groups:nui:createGroup', function(source)
    local result = exports['prp-bridge']:CreateGroup(source)
    if not result or not result.success then
        return { success = false, error = result and result.error or 'unknown_error' }
    end

    local data = getGroupData(source)
    return { success = true, data = data }
end)

lib.callback.register('fd_prp_groups:nui:getGroupData', function(source)
    return getGroupData(source)
end)

lib.callback.register('fd_prp_groups:nui:kick', function(source, data)
    local group = exports['prp-bridge']:GetGroupFromMember(source)
    if not group then return { success = false, error = 'not_in_group' } end
    if not group.isSrcALeader(source) then return { success = false, error = 'not_leader' } end

    local targetSrc = data.targetSrc
    if tostring(targetSrc) == tostring(source) then return { success = false, error = 'cannot_kick_self' } end
    if not group.isSrcAMember(targetSrc) then return { success = false, error = 'target_not_in_group' } end

    local success = group.removeMember(targetSrc)
    return { success = success }
end)

lib.callback.register('fd_prp_groups:nui:leave', function(source)
    local group = exports['prp-bridge']:GetGroupFromMember(source)
    if not group then return { success = false, error = 'not_in_group' } end

    if group.isSrcALeader(source) then
        group.disband()
    else
        group.removeMember(source)
    end

    return { success = true }
end)

lib.callback.register('fd_prp_groups:nui:toggleInviting', function(source)
    local group = exports['prp-bridge']:GetGroupFromMember(source)
    if not group then return { success = false } end
    if not group.isSrcALeader(source) then return { success = false, error = 'not_leader' } end

    group.toggleInviting()
    return { success = true, isInviting = group.isInviting() }
end)

lib.callback.register('fd_prp_groups:nui:toggleLocked', function(source, data)
    local group = exports['prp-bridge']:GetGroupFromMember(source)
    if not group then return { success = false } end
    if not group.isSrcALeader(source) then return { success = false, error = 'not_leader' } end

    group.setLocked(data.locked)
    return { success = true, isLocked = group.isLocked() }
end)

lib.callback.register('fd_prp_groups:nui:invite', function(source, data)
    local group = exports['prp-bridge']:GetGroupFromMember(source)
    if not group then return { success = false, error = 'not_in_group' } end
    if not group.isSrcALeader(source) then return { success = false, error = 'not_leader' } end
    if not group.isInviting() then return { success = false, error = 'not_inviting' } end

    local targetSrc = data.targetSrc

    local targetGroup = exports['prp-bridge']:GetGroupFromMember(targetSrc)
    if targetGroup then return { success = false, error = 'target_already_in_group' } end

    local inviteUuid = generateUUID()
    group.addPendingInvite(inviteUuid, targetSrc)

    local leaderData = group.getLeader()
    TriggerClientEvent('prp-bridge:client:receiveGroupInvite', targetSrc, {
        inviteUuid = inviteUuid,
        inviterName = leaderData and leaderData.characterName or 'Unknown',
        inviteSrc = source,
    })

    return { success = true }
end)

lib.callback.register('fd_prp_groups:nui:getNearbyPlayers', function(source)
    local playerPed = GetPlayerPed(source)
    if not playerPed or playerPed == 0 then return {} end

    local playerCoords = GetEntityCoords(playerPed)
    local nearbyRadius = config.nearbyRadius
    local nearby = {}

    local players = GetPlayers()
    for _, playerId in ipairs(players) do
        local targetSrc = tonumber(playerId)
        if targetSrc and targetSrc ~= source then
            local targetPed = GetPlayerPed(targetSrc)
            if targetPed and targetPed ~= 0 then
                local targetCoords = GetEntityCoords(targetPed)
                local distance = #(playerCoords - targetCoords)

                if distance <= nearbyRadius then
                    local targetGroup = exports['prp-bridge']:GetGroupFromMember(targetSrc)
                    local identifier = bridge.fw.getIdentifier(targetSrc)
                    local characterName = identifier and bridge.fw.getCharacterName(identifier) or GetPlayerName(targetSrc)

                    nearby[#nearby + 1] = {
                        src = targetSrc,
                        characterName = characterName,
                        distance = math.floor(distance),
                        inGroup = targetGroup ~= nil,
                    }
                end
            end
        end
    end

    table.sort(nearby, function(a, b) return a.distance < b.distance end)

    return nearby
end)

lib.callback.register('fd_prp_groups:nui:getPartyStatus', function(source)
    local group = exports['prp-bridge']:GetGroupFromMember(source)
    if not group then return nil end

    local partyUuid = group.getPartyUuid()
    if not partyUuid then
        return { active = false }
    end

    local queueName = nil
    local position = nil

    for _, queueType in ipairs({ 'crime', 'civ' }) do
        local queuesByType = exports['prp-bridge']:GetQueuesByType(queueType)
        if queuesByType then
            for name, _ in pairs(queuesByType) do
                local queue = exports['prp-bridge']:GetQueue(name)
                if queue and queue.isPartyIn(partyUuid) then
                    queueName = name
                    position = queue.getPartyPosition(partyUuid)
                    break
                end
            end
        end
        if queueName then break end
    end

    return {
        active = true,
        partyUuid = partyUuid,
        queueName = queueName,
        position = position,
    }
end)

---@param groupUuid string
local function refreshGroupForAllMembers(groupUuid)
    local group = exports['prp-bridge']:GetGroupByUuid(groupUuid)
    if not group then return end

    local memberIds = group.getMembersPlayerIds()
    for _, playerId in ipairs(memberIds) do
        if DoesPlayerExist(playerId) then
            local data = getGroupData(playerId)
            TriggerClientEvent('fd_prp_groups:client:refreshGroupData', playerId, data)
        end
    end
end

AddEventHandler('prp-bridge:server:groupMemberAdded', function(_, groupUuid)
    refreshGroupForAllMembers(groupUuid)
end)

AddEventHandler('prp-bridge:server:groupMemberRemoved', function(src, groupUuid)
    refreshGroupForAllMembers(groupUuid)

    if DoesPlayerExist(src) then
        TriggerClientEvent('fd_prp_groups:client:groupDisbanded', src)
    end
end)

AddEventHandler('prp-bridge:server:groupDisbanded', function(_, memberPlayerIds)
    if not memberPlayerIds then return end

    for _, playerId in ipairs(memberPlayerIds) do
        if DoesPlayerExist(playerId) then
            TriggerClientEvent('fd_prp_groups:client:groupDisbanded', playerId)
        end
    end
end)

AddEventHandler('prp-bridge:server:groupSettingsChanged', function(groupUuid)
    refreshGroupForAllMembers(groupUuid)
end)

AddEventHandler('prp-bridge:server:groupActivityChanged', function(groupUuid)
    refreshGroupForAllMembers(groupUuid)
end)

AddEventHandler('prp-bridge:server:groupLeaderChanged', function(groupUuid)
    refreshGroupForAllMembers(groupUuid)
end)
