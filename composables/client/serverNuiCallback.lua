---@param endpoint string
---@param cb? fun(data: any, cb: function)
local function useServerNuiCallback(endpoint, cb)
    RegisterNuiCallback(endpoint, function(data, nuiCb)
        local event = ('fd_prp_groups:nui:%s'):format(endpoint)
        local response = lib.callback.await(event, false, data)

        if cb then
            return cb(response, nuiCb)
        end

        return nuiCb(response)
    end)
end

return useServerNuiCallback
