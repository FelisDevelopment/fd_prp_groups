local integration = require 'bridge.integration'
local useServerNuiCallback = require 'composables.client.serverNuiCallback'

useServerNuiCallback('createGroup')
useServerNuiCallback('getGroupData')
useServerNuiCallback('kick')
useServerNuiCallback('leave')
useServerNuiCallback('toggleInviting')
useServerNuiCallback('toggleLocked')
useServerNuiCallback('invite')
useServerNuiCallback('getNearbyPlayers')
useServerNuiCallback('getPartyStatus')

local function fetchAndPushGroupData()
    local data = lib.callback.await('fd_prp_groups:nui:getGroupData', false)

    integration.sendAppUpdate('group:data', data)

    SetTimeout(500, function()
        integration.sendAppUpdate('app:ready', {})
    end)
end

AddEventHandler('fd_prp_groups:uiReady', fetchAndPushGroupData)
