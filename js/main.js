// ==========================================
// My Travel Atlas
// 动态生成徒步路线目录
// ==========================================


// ==========================================
// 读取徒步路线数据
// ==========================================

async function loadTrails() {

    try {

        const response = await fetch("data/trails.json");

        const data = await response.json();

        return data.trails;

    } catch (error) {

        console.error("无法读取徒步路线数据：", error);

        return [];

    }

}



// ==========================================
// 根据路线数据建立树状目录
// ==========================================

function buildNavigation(trails) {

    /*
        目录结构：

        国家
        └── 省份
            └── 市 / 州
                └── 区 / 县
                    └── 徒步区域
                        └── 徒步路线
    */

    const tree = {};


    trails.forEach(trail => {

        const location = trail.location || {};


        const country =
            location.country || "未知国家";

        const province =
            location.province || "未知省份";

        const city =
            location.city || "未知地区";

        const district =
            location.district || "未知区县";

        const area =
            trail.area || "未知徒步区域";


        // ==================================
        // 国家
        // ==================================

        if (!tree[country]) {

            tree[country] = {};

        }


        // ==================================
        // 省份
        // ==================================

        if (!tree[country][province]) {

            tree[country][province] = {};

        }


        // ==================================
        // 城市 / 地级行政区
        // ==================================

        if (!tree[country][province][city]) {

            tree[country][province][city] = {};

        }


        // ==================================
        // 区 / 县
        // ==================================

        if (!tree[country][province][city][district]) {

            tree[country][province][city][district] = {};

        }


        // ==================================
        // 徒步区域
        // ==================================

        if (!tree[country][province][city][district][area]) {

            tree[country][province][city][district][area] = [];

        }


        // ==================================
        // 徒步路线
        // ==================================

        tree[country]
            [province]
            [city]
            [district]
            [area]
            .push(trail);

    });


    return tree;

}



// ==========================================
// 创建一个可以展开 / 收起的目录节点
// ==========================================

function createFolder(title, level = 0) {


    const container =
        document.createElement("div");


    container.className =
        "nav-folder";


    // 根据层级添加 class
    container.classList.add(
        `nav-level-${level}`
    );


    // ==================================
    // 标题
    // ==================================

    const titleElement =
        document.createElement("div");


    titleElement.className =
        "nav-folder-title";


    titleElement.innerHTML = `
        <span class="arrow">▶</span>
        <span>${title}</span>
    `;


    // ==================================
    // 子内容
    // ==================================

    const childrenElement =
        document.createElement("div");


    childrenElement.className =
        "nav-folder-children";


    childrenElement.style.display =
        "none";


    // ==================================
    // 点击展开 / 收起
    // ==================================

    titleElement.addEventListener(
        "click",
        () => {

            const isOpen =
                childrenElement.style.display === "block";


            if (isOpen) {

                childrenElement.style.display =
                    "none";

                titleElement
                    .querySelector(".arrow")
                    .textContent = "▶";

            } else {

                childrenElement.style.display =
                    "block";

                titleElement
                    .querySelector(".arrow")
                    .textContent = "▼";

            }

        }
    );


    container.appendChild(
        titleElement
    );


    container.appendChild(
        childrenElement
    );


    return {

        container,

        childrenElement

    };

}



// ==========================================
// 创建路线
// ==========================================

function createTrail(trail, level = 5) {


    const element =
        document.createElement("div");


    element.className =
        "nav-trail";


    element.classList.add(
        `nav-level-${level}`
    );


    element.textContent =
        "• " + trail.name;


    // ==================================
    // 点击路线
    // ==================================

    element.addEventListener(
        "click",
        () => {

            console.log(
                "打开徒步路线：",
                trail.id
            );

        }
    );


    return element;

}



// ==========================================
// 渲染整个目录
// ==========================================

function renderNavigation(trails) {


    const sidebar =
        document.querySelector(".sidebar");


    if (!sidebar) {

        console.error(
            "找不到 sidebar"
        );

        return;

    }


    // ==================================
    // 保留 EXPLORE 标题
    // ==================================

    sidebar.innerHTML = `
        <div class="sidebar-title">
            EXPLORE
        </div>
    `;


    // ==================================
    // 建立树
    // ==================================

    const tree =
        buildNavigation(trails);


    // ==================================
    // 国家
    // ==================================

    Object.keys(tree).forEach(
        country => {


            const countryFolder =
                createFolder(
                    country,
                    0
                );


            sidebar.appendChild(
                countryFolder.container
            );


            const provinces =
                tree[country];


            // ==================================
            // 省份
            // ==================================

            Object.keys(provinces).forEach(
                province => {


                    const provinceFolder =
                        createFolder(
                            province,
                            1
                        );


                    countryFolder
                        .childrenElement
                        .appendChild(
                            provinceFolder.container
                        );


                    const cities =
                        provinces[province];


                    // ==================================
                    // 城市 / 州
                    // ==================================

                    Object.keys(cities).forEach(
                        city => {


                            const cityFolder =
                                createFolder(
                                    city,
                                    2
                                );


                            provinceFolder
                                .childrenElement
                                .appendChild(
                                    cityFolder.container
                                );


                            const districts =
                                cities[city];


                            // ==================================
                            // 区 / 县
                            // ==================================

                            Object.keys(districts).forEach(
                                district => {


                                    const districtFolder =
                                        createFolder(
                                            district,
                                            3
                                        );


                                    cityFolder
                                        .childrenElement
                                        .appendChild(
                                            districtFolder.container
                                        );


                                    const areas =
                                        districts[district];


                                    // ==================================
                                    // 徒步区域
                                    // ==================================

                                    Object.keys(areas).forEach(
                                        area => {


                                            const areaFolder =
                                                createFolder(
                                                    area,
                                                    4
                                                );


                                            districtFolder
                                                .childrenElement
                                                .appendChild(
                                                    areaFolder.container
                                                );


                                            const trailsInArea =
                                                areas[area];


                                            // ==================================
                                            // 徒步路线
                                            // ==================================

                                            trailsInArea.forEach(
                                                trail => {


                                                    const trailElement =
                                                        createTrail(
                                                            trail,
                                                            5
                                                        );


                                                    areaFolder
                                                        .childrenElement
                                                        .appendChild(
                                                            trailElement
                                                        );

                                                }
                                            );

                                        }
                                    );

                                }
                            );

                        }
                    );

                }
            );

        }
    );

}



// ==========================================
// 初始化
// ==========================================

async function init() {


    const trails =
        await loadTrails();


    renderNavigation(
        trails
    );

}


init();
