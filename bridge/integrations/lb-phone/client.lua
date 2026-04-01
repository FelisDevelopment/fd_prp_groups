local config = require 'config.general'
local isAppReady = false

CreateThread(function()
    while GetResourceState("lb-phone") ~= "started" do
        Wait(500)
    end

    local added, errorMessage = exports["lb-phone"]:AddCustomApp({
        identifier = config.appId,
        name = config.appName,
        description = config.appDescription,
        developer = "Prodigy Studios",
        defaultApp = config.defaultApp,
        size = 59812,
        fixBlur = true,
        icon = ("https://cfx-nui-%s/web/dist/groups.png"):format(GetCurrentResourceName()),
        ui = config.isDevelopment and 'https://localhost:5173/' or
            ('https://cfx-nui-%s/web/dist/index.html'):format(GetCurrentResourceName())
    })

    if not added then
        lib.print.debug('Could not add app:', errorMessage)
        return
    end

    isAppReady = true
    lib.print.debug('Groups app added.')
end)

---@param text string
---@param type? 'success' | 'error' | 'info'
local function sendNotification(text, type)
    exports["lb-phone"]:SendNotification({
        app = config.appId,
        title = config.appName,
        content = text,
    })
end

---@param action string
---@param data table
local function sendAppUpdate(action, data)
    if not isAppReady then return end

    exports["lb-phone"]:SendCustomAppMessage(config.appId, {
        action = action,
        data = data
    })
end

local function closeDevice()
    exports["lb-phone"]:ToggleOpen(false, true)
end

local function openDevice()
    exports["lb-phone"]:ToggleOpen(true, false)
end

return {
    sendAppUpdate = sendAppUpdate,
    sendNotification = sendNotification,
    closeDevice = closeDevice,
    openDevice = openDevice,
}
