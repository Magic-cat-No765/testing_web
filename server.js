DongYuri.utils = {};

DongYuri.utils.LoadResourceFromJSON = function (scene, json) {
    for (let i = 0; i < json.sprites.length; i++) {
        if (json.sprites[i].direct)
            scene.load.image(json.sprites[i].name, json.sprites[i].src);
        else
            scene.load.image(json.sprites[i].name, DongYuri.BASE_ASSETS_DIRECTORY + json.sprites[i].src);
    }

    for (let i = 0; i < json.json.length; i++)
        scene.load.json(json.json[i].name, DongYuri.BASE_ASSETS_DIRECTORY + json.json[i].src);

    for (let i = 0; i < json.plugins.length; i++) {
        if (json.plugins[i].direct)
            scene.load.plugin(json.plugins[i].name, json.plugins[i].src, true);
        else
            scene.load.plugin(json.plugins[i].name, DongYuri.BASE_ASSETS_DIRECTORY + json.plugins[i].src, true);
    }

    for (let i = 0; i < json.sfx.length; i++) {
        scene.load.audio(json.sfx[i].name, DongYuri.BASE_ASSETS_DIRECTORY + json.sfx[i].src);
    }
}

DongYuri.strings = {
    loading_resource: "Đang tải tài nguyên",
    login: "Đăng nhập",
    join_sv_notice_on_login: `Bạn phải tham gia Discord Động Yuri để chơi game. \nLink sv: ${DongYuri.SV_INVITE_LINK}`,
    roll_pet: "Gacha",
    txt_confirm_gacha: "Quay gacha (100 xu mòe/lượt). Bạn chắc chắn muốn quay chứ?",
    notice: "Thông báo",
    item_bag: "Túi đồ"
}

DongYuri.TweenDuration = 250;

DongYuri.utils.createButton = function (scene, x, y, sprite_name, touch_event_cb) {
    let newBtn = scene.add.image(x, y, sprite_name).setOrigin(0.5);
    newBtn.setInteractive().on('pointerdown', function () {
        DongYuri.utils.playSfx("Click");
        scene.tweens.add({
            targets: newBtn,
            ease: "Circ",
            scaleX: { from: 1.1, to: 1 },
            scaleY: { from: 1.1, to: 1 },
            duration: DongYuri.TweenDuration,
            onComplete: function () {
                if (touch_event_cb) {
                    touch_event_cb();
                }
            }
        });
    });
    return newBtn;
}

DongYuri.utils.playSfx = function (sfxName) {
    game.sfx[sfxName].play();
}

DongYuri.utils.playBgMusic = function (sfxName) {
    game.sound.stopAll();
    let bgMusic = game.sfx[sfxName];
    bgMusic.loop = true;
    bgMusic.play();
}

DongYuri.utils.createAutoRemoveText = function (scene, x, y, content, style, removeTimeout = 15) {
    const text = scene.add.text(x, y, content, style);
    setTimeout(function () {
        text.destroy();
    }, removeTimeout * 1000);
    return text;
}

DongYuri.utils.OpenLink = function (link, isInNewTab) {
    if (isInNewTab)
        return window.open(link, "_blank");
    else
        return window.open(link, "_self");
}

DongYuri.utils.splitString = function (str, length) {
    if (str.length - 3 < length) {
        return str.slice(0, str.length - 3) + "...";
    }
    return str;
}

DongYuri.utils.createUserInterface = function (scene) {
    scene.avatar = scene.add.image(40, 20, "avatar").setOrigin(0);
    scene.avatar.displayWidth = 80;
    scene.avatar.displayHeight = 80;

    scene.avatarBorder = scene.add.image(40, 20, "avatar_border").setOrigin(0);
    scene.avatarBorder.displayWidth = 80;
    scene.avatar.displayHeight = 80;

    scene.add.text(135, 40, DongYuri.utils.splitString(DongYuri.User.username), {
        color: "yellow",
        fontSize: "32px",
        fontFamily: "MTO Canun",
        stroke: "#000",
        strokeThickness: 5
    }).setOrigin(0, 0.5);

    scene.add.text(135, 80, DongYuri.User.xp + " xu mòe", {
        color: "white",
        fontSize: "24px",
        fontFamily: "MTO Canun",
        stroke: "#000",
        strokeThickness: 5
    }).setOrigin(0, 0.5);

    const gachaBtn = DongYuri.utils.createButton(scene, DongYuri.GAME_BASE_WIDTH - 60, 60, "gacha-btn", function () {
        scene.scene.start('gacha');
    });

    const gachaTxt = scene.add.text(gachaBtn.x, gachaBtn.y + gachaBtn.displayHeight / 2 + 5, DongYuri.strings.roll_pet, {
        font: 'Bold 24px Roboto',
        color: "white",
        stroke: 'black',
        strokeThickness: 5
    }).setOrigin(0.5, 1);

}

DongYuri.utils.createPopupNoticeFrm = function (scene, title, content, closeCb) {
    const popupFrm = scene.add.container(DongYuri.GAME_BASE_WIDTH / 2, DongYuri.GAME_BASE_HEIGHT / 2).setDepth(101);
    var popupBg = scene.add.image(0, 0, 'notice-popup').setOrigin(0.5);
    const fill = scene.add.image(0, 0, "fill").setOrigin(0.5);
    var textTitlePopupFrm = scene.add.text(0, -popupBg.displayHeight / 2 - 10, title, {
        fontStyle: "Bold",
        fontFamily: "MTO Canun",
        fontSize: "90px",
        color: '#fff4a3',
        stroke: '#e79024',
        strokeThickness: 10
    }).setOrigin(0.5);
    var popupContent = scene.add.rexBBCodeText(0, 0, content, {
        fontFamily: "Roboto",
        fontSize: "36px",
        color: 'black',
        wrap: {
            mode: 1,
            width: 600
        },
    }).setOrigin(0.5);
    var closeBtn = DongYuri.utils.createButton(scene, popupBg.x + popupBg.displayWidth / 2 - 40, popupBg.y - popupBg.displayHeight / 2 + 40, "close-btn", function () {
        scene.tweens.add({
            targets: popupFrm,
            ease: "Linear",
            alpha: { start: 1, to: 0 },
            scale: { start: 1, to: 0 },
            duration: DongYuri.TweenDuration,
            onComplete: function () {
                popupFrm.each(child => {
                    child.destroy();
                });
                if (closeCb) {
                    closeCb();
                }
            }
        });
    });
    popupFrm.add([fill, popupBg, textTitlePopupFrm, popupContent, closeBtn]);
    return popupFrm;
}

class Pet extends Phaser.GameObjects.Container {
    constructor(scene, petInfo) {
        super(scene, 0, 0);
        this.MAX_Y = DongYuri.GAME_BASE_HEIGHT - 75;
        this.MIN_Y = DongYuri.GAME_BASE_HEIGHT - 125;
        this.CHANGE_STATE_VELOCITY = 75;

        this.petInfo = petInfo;

        this.createPet(scene, `gameItem_${petInfo.base.name}`);
        this.createShadow(scene);
        this.createPetName(scene);

        this.each(child => {
            child.scale = child.depth = this.baseScale;
        }, this);
        this.petName.y = this.pet.y - this.pet.height * this.pet.scale;
        this.shadow.y = this.pet.y + (this.shadow.displayHeight / 3 * this.pet.scale);
        this.add(this.pet);

        scene.add.existing(this);
    }

    createPet(scene, sprite) {
        this.pet = scene.add.image(0, 0, sprite);
        this.pet.x = Phaser.Math.Between(0, DongYuri.GAME_BASE_WIDTH);
        this.pet.y = Phaser.Math.Between(this.MIN_Y, this.MAX_Y);
        this.pet.setOrigin(0.5, 1);
        this.baseScale = (this.pet.y / this.MAX_Y) - (1 - this.pet.y / this.MAX_Y);
        this.pet.setInteractive().on('pointerdown', this.onClick, this);
        this.pet.setName('pet');
    }

    createShadow(scene) {
        this.shadow = scene.add.image(0, 0, "pet-shadow");
        this.shadow.setOrigin(0.5, 1)
        this.shadow.setName('shadow');
        this.shadow.x = this.pet.x;
        this.add(this.shadow);
    }

    createPetName(scene) {
        this.petName = scene.add.text(0, 0, `[Lv.${this.petInfo.level}_${this.petInfo.xp}%] ${this.petInfo.base.name}`, {
            font: "Bold 20px Roboto",
            color: "yellow",
            stroke: "black",
            strokeThickness: 3
        }).setOrigin(0.5, 1);
        this.petName.x = this.pet.x;
        this.petName.setName('petName');
        this.add(this.petName);
    }

    onClick() {
        // this.alpha -= .1;
    }

    switchState(scene) {
        const newX = Phaser.Math.Between(0, DongYuri.GAME_BASE_WIDTH);
        const newY = Phaser.Math.Between(this.MIN_Y, this.MAX_Y);
        const newScale = (newY / this.MAX_Y) - (1 - newY / this.MAX_Y);
        if ((newX > this.pet.x && !this.pet.flipX) || (newX < this.pet.x && this.pet.flipX)) {
            this.pet.flipX = !this.pet.flipX;
        }
        this.each(child => {
            switch (child.name) {
                case 'pet':
                    scene.tweens.add({
                        targets: child,
                        ease: "Linear",
                        x: { start: child.x, to: newX },
                        y: { start: child.y, to: newY },
                        depth: { start: child.depth, to: newScale },
                        scale: { start: child.scale, to: newScale },
                        duration: (Math.abs(newX - child.x) / this.CHANGE_STATE_VELOCITY) * 1000,
                    });
                    break;
                case 'shadow':
                    scene.tweens.add({
                        targets: child,
                        ease: "Linear",
                        x: { start: child.x, to: newX },
                        y: { start: child.y, to: newY + (this.shadow.displayHeight / 3 * newScale) },
                        depth: { start: child.depth, to: newScale },
                        scale: { start: child.scale, to: newScale },
                        duration: (Math.abs(newX - child.x) / this.CHANGE_STATE_VELOCITY) * 1000,
                    });
                    break;
                case 'petName':
                    scene.tweens.add({
                        targets: child,
                        ease: "Linear",
                        x: { start: child.x, to: newX },
                        y: { start: child.y, to: newY - this.pet.height * newScale },
                        depth: { start: child.depth, to: newScale },
                        scale: { start: child.scale, to: newScale },
                        duration: (Math.abs(newX - child.x) / this.CHANGE_STATE_VELOCITY) * 1000,
                    });
                    break;
                default:
                    break;
            }
        });
    }

}
var boot = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function boot() {
        Phaser.Scene.call(this, {
            key: "boot"
        });
    },
    init() {
        this.load.setCORS('anonymous');
        this.load.crossOrigin = 'anonymous';
        this.additionalAudioCheck();
        this.events.on('shutdown', this.destroy, this);
    },
    preload() {
        DongYuri.utils.LoadResourceFromJSON(this, DongYuri.SceneData.boot);
    },
    create() {
        this.scene.start("loading");
    },
    destroy() {
        this.scene.remove();
    },
    additionalAudioCheck() {
        function isStock() {
            var matches = window.navigator.userAgent.match(/Android.*AppleWebKit\/([\d.]+)/);
            return matches && matches[1] < 537;
        }

        var ua = navigator.userAgent; // Returns a string which tells you what device you're using
        var isSharpStock = ((/SHL24|SH-01F/i).test(ua)) && isStock(); // Checks if device is, Sharp(SH-01F) or Sharp Mini(SHL24)
        var isXperiaAStock = ((/SO-04E/i).test(ua)) && isStock(); // Checks if device is, Xperia A(SO-04E)
        var isFujitsuStock = ((/F-01F/i).test(ua)) && isStock(); // Checks if device is, Fujitsu(F-01F)

        if (isSharpStock || isXperiaAStock || isFujitsuStock) game.device.webAudio = false;
    }
});
var loading = new Phaser.Class({

    Extends: Phaser.Scene,
    initialize: function loading() {
        Phaser.Scene.call(this, {
            key: "loading"
        });
    },
    init() {
        this.load.on("complete", function () {
            for (let i = 0; i < DongYuri.SceneData.loading.sfx.length; i++) {
                game.sfx[DongYuri.SceneData.loading.sfx[i].name] = game.sound.add(DongYuri.SceneData.loading.sfx[i].name);
            }
            DongYuri.utils.playBgMusic("bg_music");
            if (!DongYuri.User) {
                this.scene.start("login");
            } else {
                this.scene.start("home");
            }
        }, this);
        this.events.on('shutdown', this.destroy, this);
    },
    create() {
        this.bg = this.add.image(0, 0, 'loading_bg').setOrigin(0);
        this.logo = this.add.image(DongYuri.GAME_BASE_WIDTH / 2, DongYuri.GAME_BASE_HEIGHT / 2 + 100, 'logo');
        this.loadingBarOff = this.add.image(DongYuri.GAME_BASE_WIDTH / 2, 650, "loading_bar").setScale(0.8);
        this.loadingBar = this.add.image(DongYuri.GAME_BASE_WIDTH / 2, 650, "loading_bar_status").setScale(0.8);
        this.loadingBar.setCrop(0, 0, 0, 0);
        this.loadingBarWidth = this.loadingBar.width;
        this.text_loading = this.add.text(DongYuri.GAME_BASE_WIDTH / 2, 680, DongYuri.strings.loading_resource, {
            font: "Bold 28px Roboto"
        }).setOrigin(0.5, 0);
        DongYuri.utils.LoadResourceFromJSON(this, DongYuri.SceneData.loading);
        this.load.start();
        this.load.on("progress", function (value) {
            this.loadingBar.setCrop(0, 0, value * 644, 41);
        }, this);
    },
    destroy() {
        this.scene.remove();
    }

});
var login = new Phaser.Class({

    Extends: Phaser.Scene,
    initialize: function login() {
        Phaser.Scene.call(this, {
            key: "login"
        });
    },
    init() {
        this.events.on('shutdown', this.destroy, this);
    },
    create() {
        this.cameras.main.fadeFrom(500, 0, 0, 0);

        this.bg = this.add.image(0, 0, 'loading_bg').setOrigin(0);

        this.login_title = this.add.text(DongYuri.GAME_BASE_WIDTH / 2, DongYuri.GAME_BASE_HEIGHT / 2, DongYuri.strings.login, {
            font: "Bold 100px Roboto",
        }).setOrigin(0.5, 0);
        this.login_title.setStroke("#000", 10);

        if (DongYuri.noticeJoinSvOnLogin) {
            const textNotice = DongYuri.utils.createAutoRemoveText(this, DongYuri.GAME_BASE_WIDTH / 2, DongYuri.GAME_BASE_HEIGHT / 2 + 275, DongYuri.strings.join_sv_notice_on_login, {
                font: "Bold 32px Roboto",
                color: "red",
                stroke: 'white',
                strokeThickness: 5,
                align: "center"
            });
            textNotice.setOrigin(0.5, 0).setInteractive().on("pointerdown", function () {
                return DongYuri.utils.OpenLink(DongYuri.SV_INVITE_LINK, true);
            }, this);
        }

        this.bg = DongYuri.utils.createButton(this, DongYuri.GAME_BASE_WIDTH / 2, DongYuri.GAME_BASE_HEIGHT / 2 + 200, 'login_btn',
            function () {
                return DongYuri.utils.OpenLink("game/login");
            });
    },
    destroy() {
        // this.scene.remove();
    }

});
var home = new Phaser.Class({

    Extends: Phaser.Scene,
    initialize: function home() {
        Phaser.Scene.call(this, {
            key: "home"
        });
    },
    init() {
        this.upTime = 0;
        DongYuri.utils.createUserInterface(this);
        this.events.on('shutdown', this.destroy, this);
    },
    create() {
        var self = this;
        this.cameras.main.fadeFrom(500, 0, 0, 0);
        this.bg = this.add.image(0, 0, 'default_game_bg').setOrigin(0).setDepth(-1);
        this.itemBag = DongYuri.utils.createButton(this, 0, DongYuri.GAME_BASE_HEIGHT, "item_bag", function () {
            self.createItemBagContainer();
            self.itemBag.disableInteractive();
        }).setOrigin(0, 1).setDepth(100);

        this.createPets();
    },
    update(time) {
        if (Math.floor(time / 1000) - this.upTime >= 15) {
            this.upTime = Math.floor(time / 1000);
            this.pets.forEach(pet => {
                pet.switchState(this);
            });
        }
    },
    createItemBagContainer() {
        let scene = this;
        const fill = scene.add.image(0, 0, "fill").setOrigin(0.5).setInteractive();
        const itemBagContainer = this.add.container(DongYuri.GAME_BASE_WIDTH / 2, DongYuri.GAME_BASE_HEIGHT / 2).setDepth(101);
        const itemBagBg = this.add.image(0, 0, "bag-container").setOrigin(0.5);
        const itemBagCloseBtn = DongYuri.utils.createButton(this, itemBagBg.x + itemBagBg.displayWidth / 2 - 300, itemBagBg.y - itemBagBg.displayHeight / 2 + 125, "close-btn", function () {
            scene.tweens.add({
                targets: itemBagContainer,
                ease: "Linear",
                alpha: { start: 1, to: 0 },
                scale: { start: 1, to: 0 },
                duration: DongYuri.TweenDuration,
                onComplete: function () {
                    scene.itemBag.setInteractive();
                    itemBagContainer.each(child => {
                        child.destroy();
                    });
                }
            });
        });

        this.itemDesc = this.add.text(185, -175, "", {
            font: "Bold 24px Roboto",
            color: "yellow",
            stroke: "#512306",
            strokeThickness: 5,
            wordWrap: {
                width: 200,
            }
        }).setOrigin(0, 0);

        this.useItemBtn = this.add.image(-125, 325, "use-item-btn").setInteractive().on('pointerdown', function () {
            scene.useItemBtn.disableInteractive();
            fetch("/game/use-item", {
                method: "POST",
                body: new URLSearchParams({ itemInfo: JSON.stringify(scene.itemInfo) }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(dt => dt.json()).then(dt => {
                if (dt.errCode) {
                    return DongYuri.utils.createPopupNoticeFrm(scene, DongYuri.strings.notice, "Đã có lỗi xảy ra, vui lòng thử lại sau.");
                }
                DongYuri.User = dt.user;
                DongYuri.utils.createPopupNoticeFrm(scene, DongYuri.strings.notice, "Sử dụng vật phẩm thành công.", function () {
                    scene.scene.start("home");
                });
            }).catch(err => {
                DongYuri.utils.createPopupNoticeFrm(scene, DongYuri.strings.notice, "Đã có lỗi xảy ra, vui lòng thử lại sau.");
            });
        }).setVisible(false);

        itemBagContainer.add([fill, itemBagBg, this.itemDesc, itemBagCloseBtn, this.useItemBtn]);

        DongYuri.User.game.storage.forEach((item, index) => {
            let x = -150, y = 0;
            y = -130 + (Math.floor(index / 3) * 110);
            switch (index % 3) {
                case 0:
                    x = -250;
                    break;
                case 1:
                    x = -125;
                    break;
                case 2:
                    x = 0;
                    break;
                default:
                    break;
            }
            let itembag = scene.add.image(x, y, `gameItem_${item.item.name}`).setDisplaySize(100, 100).setInteractive().on('pointerdown', function () {
                scene.itemDesc.text = item.item.desc;
                scene.itemInfo = item;
                scene.useItemBtn.setVisible(true);
                itembag.setTint("#000");
                scene.useItemBtn.setInteractive();
            });
            itemBagContainer.add(itembag);
        });

    },
    createPets() {
        this.pets = [];
        DongYuri.User.game.pet.forEach(pet => {
            const newPet = new Pet(this, pet);
            this.pets.push(newPet);
        });
    },
    destroy() {
    }

});
var gacha = new Phaser.Class({

    Extends: Phaser.Scene,
    initialize: function gacha() {
        Phaser.Scene.call(this, {
            key: "gacha"
        });
    },
    init() {
        this.events.on('shutdown', this.destroy, this);
    },
    create() {
        var scene = this;
        this.cameras.main.fadeFrom(500, 0, 0, 0);
        this.bg = this.add.image(0, 0, 'roll-scene-bg').setOrigin(0).setDepth(-1);

        this.gachaTogepi = this.add.image(DongYuri.GAME_BASE_WIDTH / 2 - 300, DongYuri.GAME_BASE_HEIGHT, "gacha-togepi").setOrigin(0.5);

        this.gachaBtn = DongYuri.utils.createButton(this, DongYuri.GAME_BASE_WIDTH / 2 + 100, DongYuri.GAME_BASE_HEIGHT / 2, "roll-btn", function () {
            var r = confirm(DongYuri.strings.txt_confirm_gacha);
            if (r == true) {
                let url = "";
                if (DongYuri.User.game.newPlayer) {
                    url = "/game/roll-gacha-first-time";
                } else {
                    url = "/game/roll-gacha";
                }
                const loadingEff = document.getElementById("gacha-loading");
                loadingEff.style.visibility = "visible";
                setTimeout(function () {
                    fetch(url, {
                        method: "POST"
                    }).then(dt => dt.json()).then(dt => {
                        loadingEff.style.visibility = "hidden";
                        if (dt.errCode) {
                            return DongYuri.utils.createPopupNoticeFrm(scene, DongYuri.strings.notice, dt.message);
                        }
                        DongYuri.User = dt.user;
                        if (dt.prize) {
                            return DongYuri.utils.createPopupNoticeFrm(scene, DongYuri.strings.notice, `Chúc mừng bạn đã quay trúng [b]${dt.prize.name}[/b].`);
                        } else {
                            return DongYuri.utils.createPopupNoticeFrm(scene, DongYuri.strings.notice, `Rất tiếc, bạn không trúng phần quà nào cả. Chúc bạn may mắn lần sau.`);
                        }
                    }).catch(err => {
                        loadingEff.style.visibility = "hidden";
                        DongYuri.utils.createPopupNoticeFrm(scene, DongYuri.strings.notice, "Đã có lỗi xảy ra, vui lòng thử lại sau.");
                    })
                }, Math.round(Math.random() * 3) + 2);
            }
        });

        var self = this;
        DongYuri.utils.createButton(this, 60, 50, "back-btn", function () {
            self.scene.start('home');
        })

    },
    update(time) {
    },
    destroy() {
    }

});
var config = {
    type: Phaser.CANVAS,
    fps: {
        target: DongYuri.TARGET_FPS
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DongYuri.GAME_BASE_WIDTH,
        height: DongYuri.GAME_BASE_HEIGHT,
    },
    loader: {
        crossOrigin: "anonymous",
        async: false
    },
    // plugins: {
    //     scene: [{
    //         key: 'FollowPlugin',
    //         plugin: PhaserFollowPlugin,
    //         mapping: 'follow'
    //     }]
    // },
    scene: [boot, loading, login, home, gacha],
    dom: {
        createContainer: false,
    }
}
var game = new Phaser.Game(config);
game.sfx = {};

window.addEventListener('load', () => {
    game.events.on('blur', function () {
        // game.sound.mute = true;
    })
    game.events.on('focus', function () {
        // if (R.sound)
        // game.sound.mute = false;
    });
    game.events.on('hidden', function () {
        // if (!game.sound.mute)
        //   game.sound.mute = true;
        // else if (R.sound)
        //   game.sound.mute = false;
    });
    game.events.on('visible', function () {
        // if (!game.sound.mute)
        //   game.sound.mute = true;
        // else if (R.sound)
        //   game.sound.mute = false;
    });
    document.body.addEventListener("touchstart", function (e) {
        if (e.target.nodeName == "CANVAS") {
            e.preventDefault();
        }
    }, {
        passive: false
    });
    document.body.addEventListener("touchend", function (e) {
        if (e.target.nodeName == "CANVAS") {
            e.preventDefault();
        }
    }, {
        passive: false
    });
    document.body.addEventListener("touchmove", function (e) {
        if (e.target.nodeName == "CANVAS") {
            e.preventDefault();
        }
    }, {
        passive: false
    });

});
window.focus();