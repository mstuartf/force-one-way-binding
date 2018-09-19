// This is a simple component that receives myVar as an attribute from its parent.
// On first load it creates a local copy called myVarLocal. Then whenever myVar is 
// edited in the parent it updates myVarLocal with these changes.
// Its template shows the value of myVar and myVarLocal on its scope, with 
// a button to edit each variable.  

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
					child.myVar = {{$ctrl.myVar}}
				</h1>
				<button ng-click="$ctrl.myVar.b = $ctrl.myVar.b + 1">
					Modify
				</button>
				<h1>
					child.myVarLocal = {{$ctrl.myVarLocal}}
				</h1>
				<button ng-click="$ctrl.myVarLocal.b = $ctrl.myVarLocal.b + 1">
					Modify
				</button>
				`,
	bindings: {
		myVar: '<'
	}
})
