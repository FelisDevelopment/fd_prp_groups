---@type table
local config = require 'config.general'

---@param source number
---@param text string
---@param type? 'success' | 'error' | 'info'
local function sendNotification(source, text, type)
    exports.yflip:SendNotification({
        app = config.appId,
        title = config.appName,
        text = text,
        icon = ("https://cfx-nui-%s/web/dist/groups.png"):format(GetCurrentResourceName())
    }, 'source', source)
end

RegisterNetEvent('fd_prp_groups:server:yflip:notification', function(text, type)
    sendNotification(source, text, type)
end)

return {
    sendNotification = sendNotification,
}
