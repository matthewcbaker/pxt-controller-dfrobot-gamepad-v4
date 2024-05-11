
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
namespace controller {
    /**
     * Checks if the controller button is pressed
     * @param button The button to check
     */
    //% block="button $button is pressed"
    export function buttonIsPressed(button: ControllerButton): boolean {
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
}
