 define("ClientMessageBridge", ["ConfigurationConstants"],
    function(ConfigurationConstants) {
        return {
            messages: {
                "UpdateSwimmingLessonsDetail": {
                    "mode": Terrasoft.MessageMode.BROADCAST,
                    "direction": Terrasoft.MessageDirectionType.PUBLISH
                },
            },
            methods: {
                init: function() {
                    this.callParent(arguments);
					this.addMessageConfig({
						sender: "UpdateSwimmingLessonsDetail",
						messageName: "UpdateSwimmingLessonsDetail"
					});
                },
            }
        };
    });