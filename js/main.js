// ==========================================
// My Travel Atlas
// 双目录系统
// ① 按行政区划
// ② 按地理区域
// ==========================================


// ==========================================
// 读取徒步路线数据
// ==========================================

async function loadTrails() {

    try {

        const { data, error } = await supabaseClient
            .from("trails")
            .select("*")
            .order("id", { ascending: true });

        if (error) {
            throw error;
        }

        console.log("从 Supabase 读取到的路线：", data);


        // ==================================================
        // 把 Supabase 的扁平数据
        //
        // continent
        // country
        // province
        // city
        // district
        // region
        //
        // 转换成原来 main.js 使用的结构
        // ==================================================

        const trails = (data || []).map(trail => {

            return {

                id: trail.id,

                trail_code: trail.trail_code,

                name: trail.name,

                location: {

                    continent:
                        trail.continent || "未知洲",

                    country:
                        trail.country || "未知国家",

                    province:
                        trail.province || "未知省份",

                    city:
                        trail.city || "未知地区",

                    district:
                        trail.district || "未知区县"

                },

                geography: {

                    region:
                        trail.region || "未分类区域",

                    subregion:
                        trail.subregion || null

                },

                type:
                    trail.type,

                date:
                    trail.date,

                latitude:
                    trail.latitude,

                longitude:
                    trail.longitude,

                description:
                    trail.description,

                cover_url:
                    trail.cover_url

            };

        });


        return trails;


    } catch (error) {

        console.error(
            "无法读取 Supabase 路线数据：",
            error
        );

        return [];

    }

}


// ==========================================
// 创建目录文件夹
// ==========================================

function createFolder(title, level = 0) {

    const container =
        document.createElement("div");

    container.className =
        "nav-folder nav-level-" + level;


    // 标题

    const titleElement =
        document.createElement("div");

    titleElement.className =
        "nav-folder-title";


    titleElement.innerHTML = `
        <span class="arrow">▶</span>
        <span>${title}</span>
    `;


    // 子目录

    const childrenElement =
        document.createElement("div");

    childrenElement.className =
        "nav-folder-children";

    childrenElement.style.display =
        "none";


    // 点击展开 / 收起

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
        "nav-trail nav-level-" + level;


    element.textContent =
        "• " + trail.name;


    // 点击路线

    element.addEventListener(
        "click",
        () => {

            console.log(
                "打开徒步路线：",
                trail.id
            );

            // 以后这里可以打开具体攻略页面

        }
    );


    return element;

}


// ==========================================
// 创建目录标题
// ==========================================

function createSectionTitle(icon, title) {

    const element =
        document.createElement("div");

    element.className =
        "navigation-section-title";

    element.innerHTML = `
        <span class="section-icon">${icon}</span>
        <span>${title}</span>
    `;

    return element;

}


// ============================================================
// 第一套目录：按照行政区划
// ============================================================

function buildAdministrativeTree(trails) {

    const tree = {};


    trails.forEach(trail => {

        const location =
            trail.location || {};


        const continent =
            location.continent || "未知洲";

        const country =
            location.country || "未知国家";

        const province =
            location.province || "未知省份";

        const city =
            location.city || "未知地区";

        const district =
            location.district || "未知区县";


        // 洲

        if (!tree[continent]) {

            tree[continent] = {};

        }


        // 国家

        if (!tree[continent][country]) {

            tree[continent][country] = {};

        }


        // 省

        if (!tree[continent][country][province]) {

            tree[continent][country][province] = {};

        }


        // 市 / 州

        if (!tree[continent][country][province][city]) {

            tree[continent][country][province][city] = {};

        }


        // 区 / 县

        if (
            !tree[continent]
                [country]
                [province]
                [city]
                [district]
        ) {

            tree[continent]
                [country]
                [province]
                [city]
                [district] = [];

        }


        // 路线直接放在区县下面

        tree[continent]
            [country]
            [province]
            [city]
            [district]
            .push(trail);

    });


    return tree;

}


// ============================================================
// 第二套目录：按照地理区域
// ============================================================

function buildGeographicalTree(trails) {

    const tree = {};


    trails.forEach(trail => {

        const location =
            trail.location || {};

        const geography =
            trail.geography || {};


        const continent =
            location.continent || "未知洲";

        const country =
            location.country || "未知国家";

        const province =
            location.province || "未知地区";

        const region =
            geography.region || "未分类区域";

        const subregion =
            geography.subregion || null;


        // 洲

        if (!tree[continent]) {

            tree[continent] = {};

        }


        // 国家

        if (!tree[continent][country]) {

            tree[continent][country] = {};

        }


        // 省 / 地区

        if (!tree[continent][country][province]) {

            tree[continent][country][province] = {};

        }


        // 地理区域

        if (
            !tree[continent]
                [country]
                [province]
                [region]
        ) {

            tree[continent]
                [country]
                [province]
                [region] = {};

        }


        // 如果存在子区域

        if (subregion) {

            if (
                !tree[continent]
                    [country]
                    [province]
                    [region]
                    [subregion]
            ) {

                tree[continent]
                    [country]
                    [province]
                    [region]
                    [subregion] = [];

            }


            tree[continent]
                [country]
                [province]
                [region]
                [subregion]
                .push(trail);

        }

        // 没有子区域

        else {

            if (
                !tree[continent]
                    [country]
                    [province]
                    [region]
                    ._trails
            ) {

                tree[continent]
                    [country]
                    [province]
                    [region]
                    ._trails = [];

            }


            tree[continent]
                [country]
                [province]
                [region]
                ._trails
                .push(trail);

        }

    });


    return tree;

}


// ============================================================
// 渲染行政区划目录
// ============================================================

function renderAdministrativeNavigation(
    container,
    trails
) {

    const tree =
        buildAdministrativeTree(trails);


    Object.keys(tree).forEach(
        continent => {

            const continentFolder =
                createFolder(
                    continent,
                    0
                );

            container.appendChild(
                continentFolder.container
            );


            const countries =
                tree[continent];


            Object.keys(countries).forEach(
                country => {

                    const countryFolder =
                        createFolder(
                            country,
                            1
                        );

                    continentFolder
                        .childrenElement
                        .appendChild(
                            countryFolder.container
                        );


                    const provinces =
                        countries[country];


                    Object.keys(provinces).forEach(
                        province => {

                            const provinceFolder =
                                createFolder(
                                    province,
                                    2
                                );

                            countryFolder
                                .childrenElement
                                .appendChild(
                                    provinceFolder.container
                                );


                            const cities =
                                provinces[province];


                            Object.keys(cities).forEach(
                                city => {

                                    const cityFolder =
                                        createFolder(
                                            city,
                                            3
                                        );

                                    provinceFolder
                                        .childrenElement
                                        .appendChild(
                                            cityFolder.container
                                        );


                                    const districts =
                                        cities[city];


                                    Object.keys(districts).forEach(
                                        district => {

                                            const districtFolder =
                                                createFolder(
                                                    district,
                                                    4
                                                );

                                            cityFolder
                                                .childrenElement
                                                .appendChild(
                                                    districtFolder.container
                                                );


                                            const trailsInDistrict =
                                                districts[district];


                                            trailsInDistrict.forEach(
                                                trail => {

                                                    const trailElement =
                                                        createTrail(
                                                            trail,
                                                            5
                                                        );

                                                    districtFolder
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


// ============================================================
// 渲染地理区域目录
// ============================================================

function renderGeographicalNavigation(
    container,
    trails
) {

    const tree =
        buildGeographicalTree(trails);


    Object.keys(tree).forEach(
        continent => {

            const continentFolder =
                createFolder(
                    continent,
                    0
                );

            container.appendChild(
                continentFolder.container
            );


            const countries =
                tree[continent];


            Object.keys(countries).forEach(
                country => {

                    const countryFolder =
                        createFolder(
                            country,
                            1
                        );

                    continentFolder
                        .childrenElement
                        .appendChild(
                            countryFolder.container
                        );


                    const provinces =
                        countries[country];


                    Object.keys(provinces).forEach(
                        province => {

                            const provinceFolder =
                                createFolder(
                                    province,
                                    2
                                );

                            countryFolder
                                .childrenElement
                                .appendChild(
                                    provinceFolder.container
                                );


                            const regions =
                                provinces[province];


                            Object.keys(regions).forEach(
                                region => {

                                    const regionFolder =
                                        createFolder(
                                            region,
                                            3
                                        );

                                    provinceFolder
                                        .childrenElement
                                        .appendChild(
                                            regionFolder.container
                                        );


                                    const regionData =
                                        regions[region];


                                    // 子区域

                                    Object.keys(regionData)
                                        .forEach(
                                            key => {

                                                if (
                                                    key === "_trails"
                                                ) {
                                                    return;
                                                }


                                                const subregionFolder =
                                                    createFolder(
                                                        key,
                                                        4
                                                    );

                                                regionFolder
                                                    .childrenElement
                                                    .appendChild(
                                                        subregionFolder.container
                                                    );


                                                const trailsInSubregion =
                                                    regionData[key];


                                                trailsInSubregion.forEach(
                                                    trail => {

                                                        const trailElement =
                                                            createTrail(
                                                                trail,
                                                                5
                                                            );

                                                        subregionFolder
                                                            .childrenElement
                                                            .appendChild(
                                                                trailElement
                                                            );

                                                    }
                                                );

                                            }
                                        );


                                    // 没有子区域的路线

                                    if (
                                        regionData._trails
                                    ) {

                                        regionData
                                            ._trails
                                            .forEach(
                                                trail => {

                                                    const trailElement =
                                                        createTrail(
                                                            trail,
                                                            4
                                                        );

                                                    regionFolder
                                                        .childrenElement
                                                        .appendChild(
                                                            trailElement
                                                        );

                                                }
                                            );

                                    }

                                }
                            );

                        }
                    );

                }
            );

        }
    );

}


// ============================================================
// 主渲染函数
// ============================================================

function renderNavigation(trails) {

    const sidebar =
        document.querySelector(".sidebar");


    if (!sidebar) {

        console.error(
            "找不到 sidebar"
        );

        return;

    }


    // 清空

    sidebar.innerHTML = "";


    // 标题

    const title =
        document.createElement("div");

    title.className =
        "sidebar-title";

    title.textContent =
        "EXPLORE";

    sidebar.appendChild(title);


    // ========================================================
    // 两个目录切换按钮
    // ========================================================

    const switcher =
        document.createElement("div");

    switcher.className =
        "navigation-switcher";


    const administrativeButton =
        document.createElement("button");

    administrativeButton.className =
        "navigation-switch active";

    administrativeButton.textContent =
        "⌖ 按行政区划";


    const geographicalButton =
        document.createElement("button");

    geographicalButton.className =
        "navigation-switch";

    geographicalButton.textContent =
        "◇ 按地理区域";


    switcher.appendChild(
        administrativeButton
    );

    switcher.appendChild(
        geographicalButton
    );


    sidebar.appendChild(
        switcher
    );


    // ========================================================
    // 行政区划目录
    // ========================================================

    const administrativeContainer =
        document.createElement("div");

    administrativeContainer.className =
        "navigation-container";


    renderAdministrativeNavigation(
        administrativeContainer,
        trails
    );


    sidebar.appendChild(
        administrativeContainer
    );


    // ========================================================
    // 地理区域目录
    // ========================================================

    const geographicalContainer =
        document.createElement("div");

    geographicalContainer.className =
        "navigation-container";

    geographicalContainer.style.display =
        "none";


    renderGeographicalNavigation(
        geographicalContainer,
        trails
    );


    sidebar.appendChild(
        geographicalContainer
    );


    // ========================================================
    // 切换目录
    // ========================================================

    administrativeButton.addEventListener(
        "click",
        () => {

            administrativeButton
                .classList.add("active");

            geographicalButton
                .classList.remove("active");


            administrativeContainer
                .style.display = "block";

            geographicalContainer
                .style.display = "none";

        }
    );


    geographicalButton.addEventListener(
        "click",
        () => {

            geographicalButton
                .classList.add("active");

            administrativeButton
                .classList.remove("active");


            administrativeContainer
                .style.display = "none";

            geographicalContainer
                .style.display = "block";

        }
    );

}


// ============================================================
// 初始化
// ============================================================

async function init() {

    const trails =
        await loadTrails();

    renderNavigation(
        trails
    );

}


init();
