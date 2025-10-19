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

enum ControllerStickXY {
    X,
    Y
}

enum ControllerType {
    Physical,
    Virtual
}

enum ActionType {
    pressed,
    released
}

/**
 * Controller blocks
 */
//% weight=110 color=#109c35 icon="\uf11b"
//% groups=['Setup', 'Buttons', 'Stick X Y']
namespace controller {
    let _initialised = false
    let _virtual = false
    let _buttonstatus = ""
    let _stickx = 0
    let _sticky = 0

    function physicalControllerDetected(): boolean {
        if (
            pins.analogReadPin(AnalogPin.P1) > 400 &&
            pins.analogReadPin(AnalogPin.P1) < 600 &&
            pins.analogReadPin(AnalogPin.P2) > 400 &&
            pins.analogReadPin(AnalogPin.P2) < 600
        )
            return true
        return false
    }

    /**
     * Sets up the controller.
     */
    //% block group="Setup" weight=100
    export function initialiseController(): void {
        if (physicalControllerDetected())
            initialisePhysicalController()
        else
            initialiseVirtualController()
        _initialised = true
    }

    /**
     * Sets up a physical controller
     */
    function initialisePhysicalController(): void {
        pins.setPull(DigitalPin.P8, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P13, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P14, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P15, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P16, PinPullMode.PullNone)
        basic.forever(function () {
            radio.sendValue(getButtonStatus(), 0)
            radio.sendString(getStickStatus())
        })
    }

    /**
     * Sets up the controller as virtual
     */
    function initialiseVirtualController(): void {
        _virtual = true
        radio.onReceivedString(function (receivedString) {
            setStickStatus(receivedString)
        })
        radio.onReceivedValue(function (name, value) {
            setButtonStatus(name)
        })
    }

    /**
     * Checks if the controller has been set up
     */
    //% block group="Setup" weight=80
    export function controllerIsInitialised(): boolean {
        return _initialised
    }

    /**
     * Checks the type of the controller
     * @param ctype The controller type to check
     */
    //% block="controller type is $ctype" group="Setup"
    export function controllerType(ctype: ControllerType): boolean {
        switch (ctype) {
            case ControllerType.Physical:
                return !_virtual
            case ControllerType.Virtual:
                return _virtual
            default:
                return false
        }
    }

    function virtualButtonIsPressed(button: ControllerButton): boolean {
        switch (button) {
            case ControllerButton.A:
                return _buttonstatus.includes('A')
            case ControllerButton.B:
                return _buttonstatus.includes('B')
            case ControllerButton.C:
                return _buttonstatus.includes('C')
            case ControllerButton.D:
                return _buttonstatus.includes('D')
            case ControllerButton.E:
                return _buttonstatus.includes('E')
            case ControllerButton.F:
                return _buttonstatus.includes('F')
            case ControllerButton.Z:
                return _buttonstatus.includes('Z')
            default:
                return false
        }
    }

    /**
     * Do something when the controller button is pressed or released
     * @param button The button
     * @param action The action
     */
    //% block="on button $button $action" group="Buttons" weight=80
    export function onButtonPressed(button: ControllerButton, action: ActionType, handler: () => void) {
        let previous = buttonIsPressed(button)
        let response = (action == ActionType.pressed)
        basic.forever(function () {
            let current = buttonIsPressed(button)
            if (previous != current && current == response) {
                handler()
            }
            previous = current
        })
    }

    /**
     * Checks if the controller button is pressed
     * @param button The button to check
     */
    //% block="button $button is pressed" group="Buttons"
    export function buttonIsPressed(button: ControllerButton): boolean {
        if (!_initialised)
            return false
        if (_virtual)
            return virtualButtonIsPressed(button)
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

    function physicalUpdateXY(): void {
        _stickx = Math.round(pins.analogReadPin(AnalogPin.P1) / 5) - 100
        _sticky = Math.round(pins.analogReadPin(AnalogPin.P2) / 5) - 100
    }

    /**
     * Checks the position of the stick
     * @param position The position from -100 to +100
     */
    //% block="stick $position position" group="Stick X Y"
    export function stickXY(position: ControllerStickXY): number {
        if (!_initialised)
            return 0
        if (!_virtual)
            physicalUpdateXY()
        switch (position) {
            case ControllerStickXY.X:
                return _stickx
            case ControllerStickXY.Y:
                return _sticky
            default:
                return 0
        }
    }

    /**
     * Gets the current status so that it can be sent
     */
    function getButtonStatus(): string {
        return ''
            .concat((buttonIsPressed(ControllerButton.A) ? 'A' : '-'))
            .concat((buttonIsPressed(ControllerButton.B) ? 'B' : '-'))
            .concat((buttonIsPressed(ControllerButton.C) ? 'C' : '-'))
            .concat((buttonIsPressed(ControllerButton.D) ? 'D' : '-'))
            .concat((buttonIsPressed(ControllerButton.E) ? 'E' : '-'))
            .concat((buttonIsPressed(ControllerButton.F) ? 'F' : '-'))
            .concat((buttonIsPressed(ControllerButton.Z) ? 'Z' : '-'))
    }

    /**
     * Sets the current status so that it can be received
     */
    function setButtonStatus(status: string): void {
        if (!_initialised || !_virtual)
            return
        _buttonstatus = status
    }

    /**
     * Gets the current status so that it can be sent
     */
    function getStickStatus(): string {
        if (!_initialised)
            return "0,0"
        if (!_virtual)
            physicalUpdateXY()
        return ''
            .concat(_stickx.toString())
            .concat(',')
            .concat(_sticky.toString())
    }

    /**
     * Sets the current status so that it can be received
     */
    function setStickStatus(status: string): void {
        if (!_initialised || !_virtual)
            return
        if (status.includes(',')) {
            let xy = status.split(",");
            _stickx = parseInt(xy[0])
            _sticky = parseInt(xy[1])
        }
    }
}