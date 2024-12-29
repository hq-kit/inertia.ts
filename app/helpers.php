<?php

if (! function_exists('toast')) {
    function toast($type, $message): void
    {
        session()->flash('type', $type);
        session()->flash('message', $message);
    }
}
