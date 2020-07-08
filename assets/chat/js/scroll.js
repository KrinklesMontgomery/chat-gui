/* global $ */

require("nanoscroller");

const is_touch_device =
    "ontouchstart" in window || navigator["maxTouchPoints"]; // works on most browsers // works on IE10/11 and Surface

class ChatScrollPlugin {
    constructor(chat, e) {
        const el = $(e).get(0);
        if (!el) return;

        const $el = $(e);
        if ($el.find(".chat-scroll-notify").length > 0) {
            $el.on("update", () => {
                if (chat.contextMenu) {
                    chat.contextMenu.hide();
                    if (chat.mainwindow.locked()) {
                        chat.mainwindow.unlock();
                    }
                }
                $el.toggleClass("chat-unpinned", !this.isPinned())
            }); 
            //debounce
            $el.on("mousedown", ".chat-scroll-notify", () => false);
            $el.on("mouseup", ".chat-scroll-notify", () => {
                this.updateAndPin(true);
                return false;
            });
        }
        this.scroller = $el.nanoScroller({
            sliderMinHeight: 40,
            disableResize: true,
            alwaysVisible: is_touch_device
        })[0].nanoscroller;
    }

    isPinned() {
        // 30 is used to allow the scrollbar to be just offset, but still count as scrolled to bottom
        return !this.scroller.isActive
            ? true
            : this.scroller.contentScrollTop >= this.scroller.maxScrollTop - 30;
    }

    updateAndPin(pin) {
        this.reset();
        if (pin) this.scroller.scrollBottom(0);
    }

    reset() {
        this.scroller.reset();
    }

    destroy() {
        this.scroller.destroy();
    }
}

export default ChatScrollPlugin;
