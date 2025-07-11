(function () {
	function observeEqualizerSliders() {
		const observer = new MutationObserver(() => {
			const container = document.querySelector(".x-settings-equalizerSection");
			if (!container) {
				return;
			}
			if (container.querySelector(".equalizer-input-box")) {
				return;
			}
			const sliders = [...container.querySelectorAll(".x-settings-equalizerPanelInput")];
			if (sliders.length !== 6) {
				return;
			}
			sliders.forEach(addInputBoxToSlider);
		});
		observer.observe(document.body, { childList: true, subtree: true });
	}

	function addInputBoxToSlider(slider) {
		const sliderParent = slider.parentElement;
		if (!sliderParent) return;
		if (getComputedStyle(sliderParent).position === 'static') {
			sliderParent.style.position = 'relative';
		}
		if (sliderParent.querySelector(".equalizer-input-box")) return;

		const inputBox = document.createElement("input");
		inputBox.type = "number";
		inputBox.className = "equalizer-input-box";
		inputBox.min = slider.min;
		inputBox.max = slider.max;
		inputBox.step = slider.step;
		inputBox.value = parseFloat(slider.value).toFixed(1);

		Object.assign(inputBox.style, {
			position: 'absolute',
			bottom: '0px',
			left: '50%',
			transform: 'translateX(-50%)',
			width: '60px',
			padding: '4px 8px',
			backgroundColor: 'var(--spice-main-alt)',
			border: '1px solid var(--spice-tab-active)',
			borderRadius: 'var(--border-radius-pill)',
			color: 'var(--spice-text)',
			fontSize: '12px',
			textAlign: 'center',
			boxSizing: 'border-box',
			MozAppearance: 'textfield',
			appearance: 'textfield',
			zIndex: '100'
		});

		if (!document.getElementById('equalizer-input-style')) {
			const styleTag = document.createElement('style');
			styleTag.id = 'equalizer-input-style';
			styleTag.innerHTML = ".equalizer-input-box::-webkit-outer-spin-button, .equalizer-input-box::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }";
			document.head.appendChild(styleTag);
		}

		sliderParent.appendChild(inputBox);

		slider.addEventListener("input", () => {
			inputBox.value = parseFloat(slider.value).toFixed(1);
		});

		inputBox.addEventListener("change", () => {
			let newValue = parseFloat(inputBox.value);
			if (isNaN(newValue)) newValue = parseFloat(slider.value);
			newValue = Math.max(parseFloat(slider.min), Math.min(parseFloat(slider.max), newValue));

			slider.value = newValue;
			inputBox.value = newValue.toFixed(1);

			const inputEvent = new Event("input", { bubbles: true });
			Object.defineProperty(inputEvent, 'target', { writable: true, value: slider });
			Object.defineProperty(inputEvent.target, 'value', { writable: true, value: newValue });
			slider.dispatchEvent(inputEvent);

			const changeEvent = new Event("change", { bubbles: true });
			Object.defineProperty(changeEvent, 'target', { writable: true, value: slider });
			Object.defineProperty(changeEvent.target, 'value', { writable: true, value: newValue });
			slider.dispatchEvent(changeEvent);
		});

		const sliderValueObserver = new MutationObserver((mutationsList) => {
			for (const mutation of mutationsList) {
				if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
					if (parseFloat(inputBox.value).toFixed(1) !== parseFloat(slider.value).toFixed(1)) {
						inputBox.value = parseFloat(slider.value).toFixed(1);
					}
				}
			}
		});
		sliderValueObserver.observe(slider, { attributes: true, attributeFilter: ['value'] });

		inputBox.value = parseFloat(slider.value).toFixed(1);
	}

	if (typeof Spicetify === "undefined") {
		setTimeout(waitForSpicetify, 300);
	} else {
		observeEqualizerSliders();
	}
})();