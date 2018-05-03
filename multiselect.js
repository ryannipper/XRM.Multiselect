var XRMMultiselect;
(function (XRMMultiselect) {
    var Controller = (function () {
        function Controller() {
            this.onLoad();
        }
        Controller.prototype.onLoad = function () {
            this.myButtons = [];
            var query = window.location.search.substring(1);
            if (query != null && query.split("=").length > 1) {
                var elements = query.split("=")[1];
                elements = decodeURIComponent(elements);
                var controls = elements.split(";");
                for (var i in controls) {
                    if (controls[i] != null)
                        this.myButtons.push(new ButtonViewModel(controls[i].trim()));
                }
            }
            window.addEventListener("keydown", function (event) {
                if (event.ctrlKey == true && event.which == 83 && event.shiftKey == false) {
                    event.preventDefault();
                    window.parent.Xrm.Page.data.save();
                }
            });
        };
        return Controller;
    }());
    XRMMultiselect.Controller = Controller;
    var ButtonViewModel = (function () {
        function ButtonViewModel(controlName) {
            var _this = this;
            this.controlName = controlName;
            try {
                this.ctrl = window.parent.Xrm.Page.ui.controls.get(controlName);
                this.attr = window.parent.Xrm.Page.getAttribute(controlName);
                this.label = this.ctrl.getLabel();
                this.reqLevel = this.attr.getRequiredLevel();
				this.securityLevel = this.attr.getUserPrivilege().canUpdate;
                this.isClicked = ko.observable(this.attr.getValue());
				this.disabledState = this.ctrl.getDisabled();
                this.className = ko.computed(function () {
                    return (_this.isClicked() ? "clicked" : "unclicked") + _this.reqClassName() + _this.disabledClassName() + _this.securedClassName();
                });
                this.isRequired = ko.computed(function () {
                    return (_this.reqLevel == 'required');
                });
                this.isDisabled = ko.computed(function () {
                    return (_this.disabledState == 'disabled');
					
                });
				this.isSecured = ko.computed(function () {
                    return (_this.securityLevel == 'canUpdate');
					
                });
            }
            catch (ex) {
                console.log('Error on geting Xrm attribute', controlName, ex);
            }
        }
        ButtonViewModel.prototype.disabledClassName = function () {
            if (this.disabledState == 'none')
                return '';
            else if (this.disabledState === true)
                return " " + 'disabled';
			else
				return " " + 'enabled';
        };
        ButtonViewModel.prototype.securedClassName = function () {
            if (this.securityLevel == 'none')
                return '';
            else if (this.securityLevel === false)
                return " " + 'secured';
			else 
                return " " + 'unsecured';
        };
        ButtonViewModel.prototype.reqClassName = function () {
            if (this.reqLevel == 'none')
                return '';
            else
                return " " + this.reqLevel;
        };
        ButtonViewModel.prototype.registerClick = function () {
            this.isClicked(!this.isClicked());
            this.setValue(this.controlName, this.isClicked());
        };
        ;
        ButtonViewModel.prototype.setValue = function (controlName, value) {
            try {
                this.attr.setValue(value);
                this.attr.setSubmitMode("always");
            }
            catch (e) {
                console.log("Error: setValue", controlName, e.message);
            }
        };
        return ButtonViewModel;
    }());
    XRMMultiselect.ButtonViewModel = ButtonViewModel;
})(XRMMultiselect || (XRMMultiselect = {}));
;
//# sourceMappingURL=abr_multiselect.js.map
