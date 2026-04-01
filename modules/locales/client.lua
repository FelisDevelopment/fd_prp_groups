require 'bridge.integration'

RegisterNUICallback('locales', function(_, cb)
    local ui = {}

    for key, value in pairs(lib.getLocales()) do
        if key:sub(1, 3) == 'ui.' then
            ui[key:sub(4)] = value
        end
    end

    cb(ui)

    TriggerEvent('fd_prp_groups:uiReady')
    TriggerServerEvent('fd_prp_groups:uiReady')
end)
