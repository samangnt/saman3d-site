# Emergency Route — single-player playtest 0.7

Play at https://saman3d.com/games/EmergencyRoute/.

A separate browser conversion with an unlockable helicopter route. The original Roblox place, portfolio homepage and domain configuration are unchanged.

## Play and progress

Enter a player name once. Your name, coins and helicopter ownership stay in this browser; the game does not upload them. Complete deliveries to earn coins. The helicopter costs 10,000 coins and stays unlocked. Loading the organ into either vehicle chooses that route and removes the other vehicle.

The accompanying **Emergency-Route-Play.html** contains the game, graphics and audio in one file. Extract the ZIP, then open that HTML file in a desktop browser. No account or Internet connection is needed by the game. The same file is checked through a local HTTP preview; direct file opening and physical phone performance are separate browser environments.

For the editable folder, run `node serve.cjs` and visit `http://127.0.0.1:4177/`. Use `dist/index.html` as the normal entry point; `dist/qa.html` contains development-only checks.

## Controls

| Input | Action |
|---|---|
| WASD / arrows | Walk, drive or fly / turn |
| Shift | Run on foot; also ascend in helicopter |
| Space | Jump / exit ambulance / ascend in helicopter |
| C / Ctrl | Descend in helicopter |
| Hold E | Pick up, load, enter, unload, hand over; exit helicopter after landing |
| Hold R / F | Repair / organ care |
| I / T / B | Inventory / tasks / drop equipment |
| G / Q / X | Torch / ambulance siren / brake |
| Right drag / wheel | Look / zoom |
| P / Escape / M | Pause / pause / mute |

On phones, drag the left joystick farther to run faster. The large right-side up arrow jumps, exits the ambulance or ascends in the helicopter. Flight has a separate descend control. Hold the contextual action button for pickups and repairs. Drag to look and pinch to zoom. Fullscreen has a quick toggle and an on/off checkbox in settings; it starts automatically after PLAY where supported. Touch devices start in Performance graphics.

## Routes and changes

Collect the heart, kidney or lungs at Hospital A. The pickup prompt is available from the hospital spawn. Loading starts the viability reserve.

The ambulance route contains ten events: tyre blowout, fallen tree, emergency gate, one early timed rockfall, flood stall, overheating, fuel leak, dead battery, brake failure and damaged bridge. The late rockfall is removed. Repairs retain all 53 physical targets. Equipment has a subtle glow and equips on pickup, including when the torch is on. One heavy item can be carried at a time. Daytime is selected with 75% probability, night with 25%. Running is 1.5 times the previous speed; water no longer returns the player to the ambulance. Distances use meters and speed uses km/h. Music fades away from the lobby. Night lighting is brighter and the HUD is smaller and more transparent.

At Hospital B, drive into the glowing bay. The ambulance stops and locks; exit, collect the organ at the rear and carry it through the doors to reception.

The helicopter uses the original air-ambulance model, animated rotors and source-based flight speeds. Fly through all twelve ordered rings, descend onto the glowing Hospital B helipad and stop. Landing locks the helicopter; exit, collect the organ and walk to reception. Neither vehicle can be driven away after parking or landing for delivery.

Organ care restores 5% viability with a 45-second cooldown. Failed deliveries can revive with 50% viability. A failure after parking preserves the final carry-and-deliver stage.

## Checks and remaining limits

Browser checks cover ten ground events, 53 targets, 24 pickups, care and handover with zero game errors. Physics checks drive the full road and hospital approach, fly all twelve rings, land, and walk the organ into Hospital B from both arrival points. Touch joystick, pinch, jump, helicopter ascent/descent and holding actions are checked in the desktop browser. Actual fullscreen entry/exit, one-time naming and saved progress are checked there too.

Packed meshes retain every recovered LOD0 face and original UVs. The original kidney-container atlas is restored. Helicopter recovery includes 245 mesh assets; nineteen smaller mesh IDs remain unavailable, including some tail lettering, fittings, a lower-tail panel and nose grille. Some clothing and ambulance trim remain reconstructed. The authentic helicopter turbine loop is included; its separate rotor-spin recording remains unavailable.

Physical Android/iPhone/Safari performance and a complete human road/search playthrough remain to be tested. This friend playtest is not CrazyGames certified. See BUILD-MANIFEST.json for exact sizes, CREDITS.md for attribution and CRAZYGAMES-READINESS.md for the submission checklist.
