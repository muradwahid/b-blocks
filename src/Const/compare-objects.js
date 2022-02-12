// const defaultVal = { side: 2, two: { vertical: '0px', horizontal: '0px' }, four: { top: '0px', right: '0px', bottom: '0px', left: '0px' } }
// const defaultVal2 = { side: 2, two: { vertical: '0px', horizontal: '0px' }, four: { top: '0px', right: '0px', bottom: '0px', left: '0px' } }
const defaultVal = { side: 2, two: { vertical: '0px', horizontal: '0px' } }
const emptyObj = { two: { vertical: '0px', horizontal: '0px' }, top: '0px', right: '0px', bottom: '15px', left: '0px' }
const defaultVal2 = { side: 2, top: '0px', right: '0px', bottom: '0px', left: '0px', vertical: '0px', horizontal: '0px' }

// function deepEqual(object1, object2) {
//     const keys1 = Object.keys(object1);
//     const keys2 = Object.keys(object2);

//     if (keys1.length !== keys2.length) {
//         return false;
//     }

//     for (const key of keys1) {
//         const val1 = object1[key];
//         const val2 = object2[key];
//         const areObjects = isObject(val1) && isObject(val2);

//         if (areObjects && !deepEqual(val1, val2) || !areObjects && val1 !== val2) {
//             return false;
//         }
//     }

//     return true;
// }

const isObject = object => object != null && typeof object === 'object';

// const equalSpecific = (main, defaults) => {
//     const mainKeys = Object.keys(main);

//     for (const key of mainKeys) {
//         const mainVal = main[key];
//         const defaultVal = defaults[key];
//         const areObjects = isObject(mainVal) && isObject(defaultVal);

//         if (areObjects && !equalSpecific(mainVal, defaultVal) || !areObjects && mainVal !== defaultVal)
//             return false;
//     }

//     return true;
// }

const triCompare = (main, defaults, defaultVal) => {
	const mainKeys = Object.keys(main);

	const equalSpecific = (main, defaults) => {
		const mainKeys = Object.keys(main);

		for (const key of mainKeys) {
			const mainSingle = main[key];
			const defaultsSingle = defaults[key];
			const areObjects = isObject(mainSingle) && isObject(defaultsSingle);

			if (areObjects && !equalSpecific(mainSingle, defaultsSingle) || !areObjects && mainSingle !== defaultsSingle)
				return false;
		}

		return true;
	}

	for (const key of mainKeys) {
		const mainSingle = main[key];
		const defaultsSingle = defaults[key];
		const defaultValSingle = defaultVal[key];

		const areObjects1 = isObject(mainSingle) && isObject(defaultsSingle);
		const areObjects2 = isObject(mainSingle) && isObject(defaultValSingle);

		if (!defaultsSingle) {
			if (areObjects2 && !equalSpecific(mainSingle, defaultValSingle) || !areObjects2 && mainSingle !== defaultValSingle)
				return false;
		} else {
			if (areObjects1 && !equalSpecific(mainSingle, defaultsSingle) || !areObjects1 && mainSingle !== defaultsSingle)
				return false;
		}
	}

	return true;
}