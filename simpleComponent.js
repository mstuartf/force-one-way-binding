app.component('simpleComponent', {
	controller: function () {
		var ctrl = this;
		ctrl.$onChanges = function () {
			if (ctrl.myVar) {
				ctrl.myVarLocal = ctrl.myVarLocal || angular.copy(ctrl.myVar);
				ctrl.myVarLocal.a = ctrl.myVar.a;
			}
		}
	},
	template:   `
				<h1>
					Child prop: {{$ctrl.myVar}}
				</h1>
				<button ng-click="$ctrl.myVar.b = $ctrl.myVar.b + 1">
					Modify child prop
				</button>
				<h1>
					Local var: {{$ctrl.myVarLocal}}
				</h1>
				<button ng-click="$ctrl.myVarLocal.b = $ctrl.myVarLocal.b + 1">
					Modify local var
				</button>
				`,
	bindings: {
		myVar: '<'
	}
})
