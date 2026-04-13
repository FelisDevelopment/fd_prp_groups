---@type table
local config = require 'config.general'
local isAppReady = false

---@return nil
local function AddApp()
    local dataLoaded = exports.yphone:GetDataLoaded()
    while not dataLoaded do
        Wait(1000)
        dataLoaded = exports.yphone:GetDataLoaded()
    end

    exports.yphone:AddCustomApp({
        key = config.appId,
        name = config.appName,
        defaultApp = config.defaultApp,
        icon = {
            yos = ("https://cfx-nui-%s/web/dist/groups-yos.png"):format(GetCurrentResourceName()),
            humanoid = ("https://cfx-nui-%s/web/dist/groups-humanoid.png"):format(GetCurrentResourceName()),
        },
        ui = config.isDevelopment and 'https://localhost:5173/' or
            ('https://cfx-nui-%s/web/dist/index.html'):format(GetCurrentResourceName())
    })

    isAppReady = true
    lib.print.debug('Groups app added.')
end

---@param text string
---@param type? 'success' | 'error' | 'info'
local function sendNotification(text, type)
    TriggerServerEvent('fd_prp_groups:server:yphone:notification', text, type)
end

---@param action string
---@param data any
local function sendAppUpdate(action, data)
    if not isAppReady then return end
    exports.yphone:SendAppMessage(config.appId, {
        action = action,
        data = data
    })
end

local function closeDevice()
    exports["yphone"]:ToggleOpen(false)
end

local function openDevice()
    exports["yphone"]:ToggleOpen(true)
end

CreateThread(function()
    while GetResourceState("yphone") ~= "started" do
        Wait(500)
    end
    AddApp()
end)

return {
    sendAppUpdate = sendAppUpdate,
    sendNotification = sendNotification,
    closeDevice = closeDevice,
    openDevice = openDevice,
    zoom = 0.85,
}
