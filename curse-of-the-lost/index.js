// *** Don't change values in the list since they're used in multiple places
const roomsMenu = ["treasure", "shop", "boss", "curse", "secret", "super-secret", "ultra-secret",
                "sacrifice", "planetarium", "arcade", "challenge", "library", "devil", "angel",
                "vault", "dice", "bedroom", "red", "IM-ERROR", "mirror", "minecart",
                "remove", "large-room", "small-room-vertical", "small-room-horizontal", "symbol-A", "symbol-B", "symbol-C"];
const roomsMenuDiv = document.getElementById('roomsMenu');

// *** Right Click Handle
function handleRightClick(event){
    event.preventDefault();

    if(!event.target.classList.contains("invalid")){
            
        const { clientX: mouseX, clientY: mouseY } = event;

        roomsMenuDiv.style.top = `${mouseY}px`;
        roomsMenuDiv.style.left = `${mouseX}px`;

        let tileID;
        if(event.target.tagName == "IMG") tileID = event.target.parentNode.id;
        else tileID = event.target.id;
        console.log(tileID);

        roomsMenuDiv.setAttribute("data-tileID", tileID);

        // *** Right Click Menu Closing

        roomsMenuDiv.classList.add("visible");
        let rightClickMenuTimer = setTimeout(hideRightClickMenu, 2000);

        roomsMenuDiv.addEventListener("mouseout", (event) => {
            // console.log("Mouse no longer on Menu");
            rightClickMenuTimer = setTimeout(hideRightClickMenu, 500);
        })
        roomsMenuDiv.addEventListener("mouseover", (event) => {
            // console.log("Mouse on Menu");
            clearTimeout(rightClickMenuTimer);
        })
        function hideRightClickMenu() {
            roomsMenuDiv.classList.remove("visible");
        }

        // Tests
        if(event.target.tagName == "IMG") console.log(`[${event.target.parentNode.getAttribute("data-row")}:${event.target.parentNode.getAttribute("data-col")}]: Right click detected `);
        else console.log(`[${event.target.getAttribute("data-row")}:${event.target.getAttribute("data-col")}]: Right click detected `);
    }
}

// *** Rooms Menu
function generateRoomsMenu(){
    for(let i = 0; i < roomsMenu.length; i++){

        const div = document.createElement("div");
        div.classList.add("roomsMenuItem");
        div.setAttribute("value", roomsMenu[i]);
        div.innerHTML = `<img src="images/${roomsMenu[i]}.svg" alt="${roomsMenu[i]}"/>`;

        div.addEventListener('click', (event) => {

            currentTile = div.parentNode.getAttribute("data-tileID");
            // let currentTile;
            // console.log(event.target.parentNode.tagName);
            // console.log(event.target.parentNode.getAttribute("data-tileID"));
            // console.log(div.parentNode.getAttribute("data-tileID"));
            // if(event.target.tagName == "IMG") currentTile = event.target.parentNode.getAttribute("data-tileID");
            // else currentTile = div.parentNode.getAttribute("data-tileID");

            // *** Right Click Menu Checking for Choice
            let roomMenuIconTiles = ["treasure", "shop", "boss", "curse", "secret", "super-secret", "ultra-secret",
            "sacrifice", "planetarium", "arcade", "challenge", "library", "devil", "angel",
            "vault", "dice", "bedroom", "red", "IM-ERROR", "mirror", "minecart", "symbol-A", "symbol-B", "symbol-C"];
            if(roomMenuIconTiles.includes(div.getAttribute("value"))){
                document.getElementById(currentTile).innerHTML = `<img src="images/${roomsMenu[i]}.svg" alt="${roomsMenu[i]}"/>`;
                roomsMenuDiv.classList.remove("visible");
            }
            // *** Remove Tile
            else if(div.getAttribute("value") == "remove"){
                document.getElementById(currentTile).innerHTML = ``;
                document.getElementById(currentTile).classList = "";
                document.getElementById(currentTile).classList.add("tile", "invalid");
                roomsMenuDiv.classList.remove("visible");
            }
            // *** Large and Small rooms
            /*
            Replace "small-room-vertical" and "small-room-horizontal" from RIGHT CLICK MENU with "small-room" option and "empty-tile" on the left of "remove" option.
            Making "small-room" similar way like "large-room", and "empty-tile" would be a quicker way to remove custom tile from board instead of removing that tile completely.

            Keep in mind that all IMG files should have their own CLEARED/UNCLEARED versions.
            Switching between CLEARED/UNCLEARED should apply to all connected tiles to the one that was clicked.
            What about the gap between images on the board? (side task to make it visually better)

            'large-room':

            IMG files needed:
            (lr - large room, all corners for 2x2 room)
            - lr-top-left 
            - lr-top-right
            - lr-bottom-left
            - lr-bottom-right
            (L shaped large rooms using corners from 2x2 and having U shaped ends, point(ing) at said direction)
            - lr-u-point-top
            - lr-u-point-bottom
            - lr-u-point-left
            - lr-u-point-right

            1. Right click on ORIGINAL TILE and choosing 'large-room' searches for tiles with INVALID tag and paints them green (or should it also search for other tiles too?)
                1a. If GREEN TILE/S exist:
                    2a. Clicking GREEN TILE:
                        3. Merges chosen tile with ORIGINAL TILE (2 tiles merged) and shows another set of GREEN TILES.
                            3a. Click GREEN TILE:
                                4. Merges chosen tile with ORIGINAL TILE (3 tiles merged) and paints only corner tile green (if exists; since that's max large room possible)
                                    4a. Click GREEN TILE.
                                        5. Merges chosen tile with ORIGINAL TILE.
                                        6. Ends 'large-room' option.
                                        -END-
                                    4b. Click ORIGINAL TILE.
                                        5. Ends 'large-room' option.
                                        -END-
                            3b. Click ORIGINAL TILE.
                                4. Ends 'large-room' option.
                                -END-
                    2b. Click ORIGINAL TILE.
                        3. Ends 'large-room' option.
                        -END-
                1b. If there is no GREEN TILE:
                    2. Pop-up that large room isn't possible?
                    -END-



                    
            'small-room':
            
            IMG files needed:
            (sr - small room)
            - sr-single-vertical (1x1 vertical)
            - sr-single-horizontal (1x1 horizontal)
            (vertical 1x2)
            - sr-top-vertical
            - sr-bottom-vertical
            (horizontal 1x2)
            - sr-left-horizontal
            - sr-right-horizontal

            1. Right click on ORIGINAL TILE and choosing 'small-room' checks if there is only one non-INVALID room OR two non-INVALID parallel rooms on both sides of ORIGINAL TILE.
                1a. Impossible to make a small-room.
                    2. Pop-up saying that you can't make a small room in the place you clicked? With instructions what you can do to make one?
                -END-
                1b. Small room possible.
                    2. Searches for tiles with INVALID tag and paints them green.
                        2a. If GREEN TILE/S exist.
                            3a. Click GREEN TILE.
                                4. Automatically creates a double small-room with correct direction based on naighbor tile.
                                5. Ends 'small-room' option.
                                -END-
                            3b. Click ORIGINAL TILE.
                                4. Ends 'small-room' option.
                                -END-
                        2b. If there is no GREEN TILE:
                            3. Automatically checks where is neeighbor tile and chooses if small room should be veritcal or horizontal.
                            4. Ends 'small-room' option.
                            -END-
            */
        })

        document.getElementById('roomsMenu').appendChild(div);
    }
}

generateRoomsMenu();







// *** Grid tiles generator
function generateTiles(rows, cols){

    for(let i = 0; i < rows * cols; i++){

        const div = document.createElement("div");
        div.classList.add("tile", "invalid");
        div.setAttribute("data-row", Math.floor(i / 15));
        div.setAttribute("data-col", i % 15);
        div.setAttribute("id", `tile${i}`);

        // div.addEventListener('click', handleClick)

        // *** Applying Events to 13x13 inner grid
        if(i > 15 && i % 15 != 0 && i % 15 != 14 && i < 209 && i != 112){
            // Left Click Event
            div.addEventListener('click', (event) => {
                let position = `My position is: [${div.getAttribute("data-row")}:${div.getAttribute("data-col")}]`;
                console.log(position);

                if(!div.classList.contains("uncleared") && !div.classList.contains("cleared")) div.classList.replace("invalid", "uncleared");
                else if(div.classList.contains("uncleared")) div.classList.replace("uncleared", "cleared");
                else div.classList.replace("cleared", "uncleared");
            })

            // *** Right Click Event
            div.addEventListener('contextmenu', handleRightClick);
        }
  
        // const handleClick = (event) => {
        //     console.log('someone clicked me 3')
        // }
        // div.addEventListener('click', handleClick)

        document.getElementById('grid').appendChild(div);
        console.log('insterted tile');
    }
}

generateTiles(15, 15);