
// ----------------------------------------------------------------------------------------------
// CONFIG ---------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------

var config = {
	controllerAs: '$ctrl',
	shadowPrefix: 'FOWB_'
};

// ----------------------------------------------------------------------------------------------
// HELPER FUNCTIONS  ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------

function createShadowName (originalAttrValue) {
	return originalAttrValue.replace(
		config.controllerAs + '.', config.controllerAs + '.' + config.shadowPrefix
	);
};

function getOriginalName (shadowAttrValue) {
	return shadowAttrValue.replace(config.shadowPrefix, '');
};

function getVarName (attrValue) {
	return attrValue.replace(config.controllerAs + '.', '');
};

function isReferenceAttribute (scope, attrValue) {
	return attrValue && 
		typeof attrValue === 'string' && 
		typeof scope[config.controllerAs][getVarName(attrValue)] === 'object';
	
};

function isShadowAttribute (attrValue) {
	return attrValue && typeof attrValue === 'string' && attrValue.indexOf(config.shadowPrefix) > -1;
};

// ----------------------------------------------------------------------------------------------
// DIRECTIVE ------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------

app.directive('forceOneWayBinding', function ($compile) {
	return {
		link: function (scope, element, attrs) {

			// the first time the component compiles, reset all custom attributes bound to parent 
			// scope variables to shadow variables prefixed by 'FOWB_', then recompile
			if (!attrs.hasOwnProperty('onWayBindingForced')) {

				// find and re-direct each custom attribute
				angular.forEach(attrs, function (value, key) {
					if (isReferenceAttribute(scope, value)) {
						attrs.$set(key, createShadowName(value))
					}
				})

				// record that the re-binding has been done to prevent an infinite loop
				attrs.$set('onWayBindingForced', true);

				// then recompile the component
				$compile(element)(scope);

			}

			// once the component is recompiled with attributes referencing shadow parent scope variables, 
			// set up watchers to keep shadow variables up-to-date and show a warning in the console if 
			// components modify their properties without creating local copies
			else {

				angular.forEach(attrs, function (value, key) {

					if (isShadowAttribute(value)) {
						
						var originalName = getOriginalName(value),
							originalVar = originalName.replace(config.controllerAs + '.', ''),
							shadowVar = config.shadowPrefix + originalVar;

						// whenever the original parent scope variable changes, update the shadow variable
						scope.$watch(originalName, function () {
							scope.$ctrl[shadowVar] = angular.copy(scope.$ctrl[originalVar]);
						}, true);

						// it the shadow variable changes and does not match the original, it must have 
						// been modified in the component --> show a console warning to the user
						scope.$watch(value, function () {
							if (JSON.stringify(scope.$ctrl[shadowVar]) !== JSON.stringify(scope.$ctrl[originalVar]))
								console.warn(
							`You are modifying the property myVar directly - changes may be overwritten by the parent.
							Please create a local copy of this property to modfy inside the component.`
							)
						}, true)

					}
					
				})

			}

		}
	}
})

