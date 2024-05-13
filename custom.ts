
/**
* Use this file to define custom functions and blocks.
* Read more at https://makecode.microbit.org/blocks/custom
*/

enum ControllerButton {
    A,
    B,
    C,
    D,
    E,
    F,
    Z
}

/**
 * Controller blocks
 */
//% weight=150 color=#109c35 icon="\uf11b"
//% groups=['Setup', 'Buttons', 'Transfer']
namespace controller {
    let _initialised = false

    /**
     * Sets up the controller
     */
    //% block group="Setup"
    export function initialiseController(): void {
        pins.setPull(DigitalPin.P8, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P13, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P14, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P15, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P16, PinPullMode.PullNone)
        _initialised = true
    }

    /**
     * Checks if the controller has been set up
     */
    //% block group="Setup"
    export function controllerIsInitialised(): boolean {
        return _initialised
    }
    
    /**
     * Checks if the controller button is pressed
     * @param button The button to check
     */
    //% block="button $button is pressed" group="Buttons"
    export function buttonIsPressed(button: ControllerButton): boolean {
        if (!_initialised)
            return false
        switch (button) {
            case ControllerButton.A:
                return input.buttonIsPressed(Button.A)
            case ControllerButton.B:
                return input.buttonIsPressed(Button.B)
            case ControllerButton.C:
                return pins.digitalReadPin(DigitalPin.P13) == 0
            case ControllerButton.D:
                return pins.digitalReadPin(DigitalPin.P14) == 0
            case ControllerButton.E:
                return pins.digitalReadPin(DigitalPin.P15) == 0
            case ControllerButton.F:
                return pins.digitalReadPin(DigitalPin.P16) == 0
            case ControllerButton.Z:
                return pins.digitalReadPin(DigitalPin.P8) == 0
            default:
                return false
        }
    }

    /**
     * Gets the current status so that it can be sent
     */
    //% block group="Transfer"
    export function getButtonStatus(): string {
        return ''
            .concat((buttonIsPressed(ControllerButton.A) ? 'A' : '-'))
            .concat((buttonIsPressed(ControllerButton.B) ? 'B' : '-'))
            .concat((buttonIsPressed(ControllerButton.C) ? 'C' : '-'))
            .concat((buttonIsPressed(ControllerButton.D) ? 'D' : '-'))
            .concat((buttonIsPressed(ControllerButton.E) ? 'E' : '-'))
            .concat((buttonIsPressed(ControllerButton.F) ? 'F' : '-'))
            .concat((buttonIsPressed(ControllerButton.Z) ? 'Z' : '-'))
    }
}
