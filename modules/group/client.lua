local integration = require 'bridge.integration'

RegisterNetEvent('fd_prp_groups:client:refreshGroupData', function(groupData)
    integration.sendAppUpdate('group:data', groupData)
end)

RegisterNetEvent('fd_prp_groups:client:groupDisbanded', function()
    integration.sendAppUpdate('group:disbanded', {})
end)

AddEventHandler('fd_prp_groups:uiReady', function()
    local theme = require 'config.theme'
    integration.sendAppUpdate('config:theme', theme)
end)
