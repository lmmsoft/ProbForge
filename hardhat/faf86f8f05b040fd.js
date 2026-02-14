;!function() {
    try {
        var e = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof global ? global : "undefined" != typeof window ? window : "undefined" != typeof self ? self : {}
          , n = (new e.Error).stack;
        n && ((e._debugIds || (e._debugIds = {}))[n] = "93534aae-8bf6-e495-4fec-617cd87ae924")
    } catch (e) {}
}();
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 475254, e => {
    "use strict";
    var t = e.i(271645);
    let n = e => {
        let t = e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase());
        return t.charAt(0).toUpperCase() + t.slice(1)
    }
      , a = (...e) => e.filter( (e, t, n) => !!e && "" !== e.trim() && n.indexOf(e) === t).join(" ").trim();
    var r = {
        xmlns: "http://www.w3.org/2000/svg",
        width: 24,
        height: 24,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
    };
    let o = (0,
    t.forwardRef)( ({color: e="currentColor", size: n=24, strokeWidth: o=2, absoluteStrokeWidth: i, className: u="", children: s, iconNode: p, ...l}, m) => (0,
    t.createElement)("svg", {
        ref: m,
        ...r,
        width: n,
        height: n,
        stroke: e,
        strokeWidth: i ? 24 * Number(o) / Number(n) : o,
        className: a("lucide", u),
        ...!s && !(e => {
            for (let t in e)
                if (t.startsWith("aria-") || "role" === t || "title" === t)
                    return !0
        }
        )(l) && {
            "aria-hidden": "true"
        },
        ...l
    }, [...p.map( ([e,n]) => (0,
    t.createElement)(e, n)), ...Array.isArray(s) ? s : [s]]))
      , i = (e, r) => {
        let i = (0,
        t.forwardRef)( ({className: i, ...u}, s) => (0,
        t.createElement)(o, {
            ref: s,
            iconNode: r,
            className: a(`lucide-${n(e).replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`, `lucide-${e}`, i),
            ...u
        }));
        return i.displayName = n(e),
        i
    }
    ;
    e.s(["default", () => i], 475254)
}
, 753519, 339032, 975157, 685149, e => {
    "use strict";
    var t = e.i(247167)
      , n = e.i(309682)
      , a = e.i(110163)
      , r = e.i(599509)
      , o = e.i(285973)
      , i = e.i(644616)
      , u = e.i(668375);
    let s = (0,
    e.i(538463).defineChain)({
        id: 31337,
        name: "Hardhat",
        nativeCurrency: {
            decimals: 18,
            name: "Ether",
            symbol: "ETH"
        },
        rpcUrls: {
            default: {
                http: ["http://127.0.0.1:8545"]
            }
        }
    });
    e.s(["hardhat", 0, s], 339032);
    var p = e.i(297197)
      , l = e.i(881837);
    function m(e, t="") {
        if (!isFinite(e) || isNaN(e))
            return `${t}0`;
        e < 0 && (e = Math.abs(e));
        let n = (e, t) => parseFloat(e.toFixed(t)).toString();
        return e >= 1e12 ? `${t}${n(e / 1e12, 2)}T` : e >= 1e9 ? `${t}${n(e / 1e9, 2)}B` : e >= 1e6 ? `${t}${n(e / 1e6, 2)}M` : e >= 1e3 ? `${t}${n(e / 1e3, 2)}K` : e >= 1 ? `${t}${n(e, 2)}` : e >= .01 ? `${t}${n(e, 4)}` : e >= 1e-4 ? `${t}${n(e, 6)}` : e > 0 ? `${t}< 0.0001` : `${t}0`
    }
    function c(e) {
        if (!isFinite(e) || isNaN(e))
            return "0";
        let t = Math.abs(e)
          , n = e >= 0 ? "+" : "-";
        return t >= 1e9 ? `${n}${(t / 1e9).toFixed(1)}B` : t >= 1e6 ? `${n}${(t / 1e6).toFixed(1)}M` : t >= 1e4 ? `${n}${(t / 1e3).toFixed(0)}K` : t >= 1e3 ? `${n}${(t / 1e3).toFixed(1)}K` : t >= 100 ? `${n}${t.toFixed(0)}` : t >= 10 ? `${n}${t.toFixed(1)}` : `${n}${t.toFixed(2)}`
    }
    function d(e) {
        if (!isFinite(e) || isNaN(e) || 0 === e)
            return "0";
        let t = t => e.toFixed(t).replace(/\.?0+$/, "");
        return e >= 1 ? t(4) : e >= 1e-4 ? t(6) : e >= 1e-8 ? t(10) : e >= 1e-13 ? t(14) : e > 0 ? "< 0.0000000000001" : "0"
    }
    function y(e) {
        return parseFloat(e.toFixed(3)).toString()
    }
    e.s(["formatCompact", () => m, "formatEthPriceReadable", () => d, "formatPercentage", () => c, "formatTokenDisplay", () => y], 975157);
    let b = "https://olive-defensive-giraffe-83.mypinata.cloud/ipfs/";
    function f(e) {
        if (!e)
            return "";
        let t = null;
        return (e.startsWith("ipfs://") ? t = e.replace("ipfs://", "") : e.includes("/ipfs/") && (t = e.split("/ipfs/")[1]),
        t) ? `${b}${t}` : e
    }
    let h = {
        TWO_COL: 792,
        THREE_COL: 1162,
        FOUR_COL: 1562,
        FIVE_COL: 1992
    };
    function g() {
        let {TWO_COL: e, THREE_COL: t, FOUR_COL: n} = h;
        return `(max-width: ${e - 1}px) 100vw, (max-width: ${t - 1}px) 50vw, (max-width: ${n - 1}px) 33vw, 25vw`
    }
    e.s(["DEFAULT_SORT", 0, "marketCap", "IPFS_GATEWAY", 0, b, "PAGINATION", 0, {
        PAGE_SIZE: 48
    }, "POLL_INTERVALS", 0, {
        FAST: 3e3,
        NORMAL: 1e4,
        SLOW: 3e4
    }, "SORT_OPTIONS", 0, {
        newest: {
            label: "Newest",
            orderBy: "createdAt",
            orderDirection: "desc"
        },
        marketCap: {
            label: "Market Cap",
            orderBy: "lastPriceEth",
            orderDirection: "desc"
        }
    }, "getImageSizes", () => g, "toConfiguredGateway", () => f], 685149);
    let k = {
        base: {
            chainId: 8453,
            name: "Base",
            hardhatNetwork: "base",
            subgraphNetwork: "base",
            rpcUrl: "",
            blockExplorer: "https://basescan.org",
            chainlink: {
                proxy: "0x57d2d46Fc7ff2A7142d479F2f59e1E3F95447077",
                aggregator: "0x57d2d46Fc7ff2A7142d479F2f59e1E3F95447077"
            },
            weth: "0x4200000000000000000000000000000000000006",
            aerodromeRouter: "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43",
            aerodromeFactory: "0x420DD381b31aEf6683db6B902084cB0FFECe40Da"
        },
        baseSepolia: {
            chainId: 84532,
            name: "Base Sepolia",
            hardhatNetwork: "baseSepolia",
            subgraphNetwork: "base-sepolia",
            rpcUrl: "",
            blockExplorer: "https://sepolia.basescan.org",
            chainlink: {
                proxy: "0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1",
                aggregator: "0xa24A68DD788e1D7eb4CA517765CFb2b7e217e7a3"
            },
            weth: null,
            aerodromeRouter: null,
            aerodromeFactory: null
        },
        localhost: {
            chainId: 31337,
            name: "Localhost",
            hardhatNetwork: "localhost",
            subgraphNetwork: "",
            rpcUrl: "http://127.0.0.1:8545",
            blockExplorer: "",
            chainlink: {
                proxy: "0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1",
                aggregator: "0xa24A68DD788e1D7eb4CA517765CFb2b7e217e7a3"
            },
            weth: null,
            aerodromeRouter: null,
            aerodromeFactory: null
        },
        localFork: {
            chainId: 8453,
            name: "Local Fork",
            hardhatNetwork: "localFork",
            subgraphNetwork: "",
            rpcUrl: "http://127.0.0.1:8545",
            blockExplorer: "https://basescan.org",
            chainlink: {
                proxy: "0x57d2d46Fc7ff2A7142d479F2f59e1E3F95447077",
                aggregator: "0x57d2d46Fc7ff2A7142d479F2f59e1E3F95447077"
            },
            weth: "0x4200000000000000000000000000000000000006",
            aerodromeRouter: "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43",
            aerodromeFactory: "0x420DD381b31aEf6683db6B902084cB0FFECe40Da"
        }
    };
    k.hardhat = k.localhost;
    let w = "mainnet"
      , v = [{
        inputs: [{
            name: "name",
            type: "string"
        }, {
            name: "symbol",
            type: "string"
        }, {
            name: "uri",
            type: "string"
        }, {
            name: "deadline",
            type: "uint256"
        }],
        name: "createToken",
        outputs: [{
            name: "curveAddress",
            type: "address"
        }, {
            name: "tokenAddress",
            type: "address"
        }, {
            name: "tokensReceived",
            type: "uint256"
        }],
        stateMutability: "payable",
        type: "function"
    }, {
        inputs: [],
        name: "totalCurves",
        outputs: [{
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [{
            name: "start",
            type: "uint256"
        }, {
            name: "count",
            type: "uint256"
        }],
        name: "getCurves",
        outputs: [{
            name: "",
            type: "address[]"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [{
            name: "",
            type: "uint256"
        }],
        name: "allCurves",
        outputs: [{
            name: "",
            type: "address"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        anonymous: !1,
        inputs: [{
            indexed: !0,
            name: "curve",
            type: "address"
        }, {
            indexed: !0,
            name: "token",
            type: "address"
        }, {
            indexed: !1,
            name: "name",
            type: "string"
        }, {
            indexed: !1,
            name: "symbol",
            type: "string"
        }, {
            indexed: !0,
            name: "creator",
            type: "address"
        }],
        name: "CurveCreated",
        type: "event"
    }, {
        anonymous: !1,
        inputs: [{
            indexed: !0,
            name: "curve",
            type: "address"
        }, {
            indexed: !0,
            name: "creator",
            type: "address"
        }, {
            indexed: !1,
            name: "ethAmount",
            type: "uint256"
        }, {
            indexed: !1,
            name: "tokensReceived",
            type: "uint256"
        }],
        name: "InitialPurchase",
        type: "event"
    }, {
        inputs: [{
            name: "creator",
            type: "address"
        }],
        name: "getCreatorCurves",
        outputs: [{
            name: "",
            type: "address[]"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [{
            name: "creator",
            type: "address"
        }],
        name: "getCreatorCurveCount",
        outputs: [{
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [{
            name: "",
            type: "address"
        }],
        name: "curveCreator",
        outputs: [{
            name: "",
            type: "address"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "getBondingCurveConfig",
        outputs: [{
            name: "initialVirtualEth",
            type: "uint256"
        }, {
            name: "bondingCurveSupply",
            type: "uint256"
        }, {
            name: "currentGraduationThreshold",
            type: "uint256"
        }, {
            name: "feePercent",
            type: "uint256"
        }, {
            name: "feeDenominator",
            type: "uint256"
        }, {
            name: "totalSupply",
            type: "uint256"
        }, {
            name: "lpSupply",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "getInitialVirtualToken",
        outputs: [{
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [{
            name: "ethAmount",
            type: "uint256"
        }],
        name: "estimateTokensForEth",
        outputs: [{
            name: "tokensOut",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [{
            name: "tokenAmount",
            type: "uint256"
        }],
        name: "estimateEthForTokens",
        outputs: [{
            name: "ethRequired",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "getMaxPurchasableTokens",
        outputs: [{
            name: "maxTokens",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "getMaxPurchaseEth",
        outputs: [{
            name: "maxEth",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "getPurchaseCapPercent",
        outputs: [{
            name: "percent",
            type: "uint256"
        }, {
            name: "denominator",
            type: "uint256"
        }],
        stateMutability: "pure",
        type: "function"
    }, {
        inputs: [{
            name: "token",
            type: "address"
        }],
        name: "tokenToCurve",
        outputs: [{
            name: "",
            type: "address"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [{
            name: "curve",
            type: "address"
        }],
        name: "isCurve",
        outputs: [{
            name: "",
            type: "bool"
        }],
        stateMutability: "view",
        type: "function"
    }]
      , x = [{
        inputs: [{
            name: "minTokensOut",
            type: "uint256"
        }, {
            name: "deadline",
            type: "uint256"
        }],
        name: "buy",
        outputs: [{
            name: "",
            type: "uint256"
        }],
        stateMutability: "payable",
        type: "function"
    }, {
        inputs: [{
            name: "tokenAmount",
            type: "uint256"
        }, {
            name: "minEthOut",
            type: "uint256"
        }, {
            name: "deadline",
            type: "uint256"
        }],
        name: "sell",
        outputs: [{
            name: "",
            type: "uint256"
        }],
        stateMutability: "nonpayable",
        type: "function"
    }, {
        inputs: [{
            name: "ethAmount",
            type: "uint256"
        }],
        name: "getTokensForEth",
        outputs: [{
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [{
            name: "tokenAmount",
            type: "uint256"
        }],
        name: "getEthForTokens",
        outputs: [{
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [{
            name: "tokenAmount",
            type: "uint256"
        }],
        name: "getEthRequiredForTokens",
        outputs: [{
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "getCurrentPrice",
        outputs: [{
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "getMarketCap",
        outputs: [{
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "token",
        outputs: [{
            name: "",
            type: "address"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "name",
        outputs: [{
            name: "",
            type: "string"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "symbol",
        outputs: [{
            name: "",
            type: "string"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "uri",
        outputs: [{
            name: "",
            type: "string"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "contractURI",
        outputs: [{
            name: "",
            type: "string"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "createdAt",
        outputs: [{
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "virtualEthReserve",
        outputs: [{
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "virtualTokenReserve",
        outputs: [{
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "realEthReserve",
        outputs: [{
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "getCurveInfo",
        outputs: [{
            name: "tokenAddress",
            type: "address"
        }, {
            name: "_name",
            type: "string"
        }, {
            name: "_symbol",
            type: "string"
        }, {
            name: "_uri",
            type: "string"
        }, {
            name: "currentPrice",
            type: "uint256"
        }, {
            name: "marketCap",
            type: "uint256"
        }, {
            name: "_virtualEthReserve",
            type: "uint256"
        }, {
            name: "_virtualTokenReserve",
            type: "uint256"
        }, {
            name: "tokensAvailable",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "graduated",
        outputs: [{
            name: "",
            type: "bool"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "pool",
        outputs: [{
            name: "",
            type: "address"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "graduatedAt",
        outputs: [{
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "lpTokensBurned",
        outputs: [{
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "canGraduate",
        outputs: [{
            name: "",
            type: "bool"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "getGraduationProgress",
        outputs: [{
            name: "progress",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [{
            name: "deadline",
            type: "uint256"
        }],
        name: "graduate",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    }, {
        inputs: [],
        name: "getGraduationInfo",
        outputs: [{
            name: "_graduated",
            type: "bool"
        }, {
            name: "progress",
            type: "uint256"
        }, {
            name: "ethCollected",
            type: "uint256"
        }, {
            name: "ethThreshold",
            type: "uint256"
        }, {
            name: "_pool",
            type: "address"
        }, {
            name: "_graduatedAt",
            type: "uint256"
        }, {
            name: "_lpTokensBurned",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "GRADUATION_ETH_THRESHOLD",
        outputs: [{
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "getEthNeededForGraduation",
        outputs: [{
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [{
            name: "ethAmount",
            type: "uint256"
        }],
        name: "simulateBuy",
        outputs: [{
            name: "ethToUse",
            type: "uint256"
        }, {
            name: "tokensOut",
            type: "uint256"
        }, {
            name: "refundAmount",
            type: "uint256"
        }, {
            name: "willGraduate",
            type: "bool"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        anonymous: !1,
        inputs: [{
            indexed: !0,
            name: "buyer",
            type: "address"
        }, {
            indexed: !1,
            name: "ethIn",
            type: "uint256"
        }, {
            indexed: !1,
            name: "tokensOut",
            type: "uint256"
        }, {
            indexed: !1,
            name: "newPrice",
            type: "uint256"
        }],
        name: "TokensPurchased",
        type: "event"
    }, {
        anonymous: !1,
        inputs: [{
            indexed: !0,
            name: "seller",
            type: "address"
        }, {
            indexed: !1,
            name: "tokensIn",
            type: "uint256"
        }, {
            indexed: !1,
            name: "ethOut",
            type: "uint256"
        }, {
            indexed: !1,
            name: "newPrice",
            type: "uint256"
        }],
        name: "TokensSold",
        type: "event"
    }, {
        anonymous: !1,
        inputs: [{
            indexed: !0,
            name: "pool",
            type: "address"
        }, {
            indexed: !1,
            name: "ethLiquidity",
            type: "uint256"
        }, {
            indexed: !1,
            name: "tokenLiquidity",
            type: "uint256"
        }, {
            indexed: !1,
            name: "lpTokensBurned",
            type: "uint256"
        }, {
            indexed: !1,
            name: "timestamp",
            type: "uint256"
        }],
        name: "Graduated",
        type: "event"
    }, {
        anonymous: !1,
        inputs: [{
            indexed: !0,
            name: "buyer",
            type: "address"
        }, {
            indexed: !1,
            name: "refundAmount",
            type: "uint256"
        }],
        name: "ExcessRefunded",
        type: "event"
    }]
      , A = [{
        inputs: [{
            name: "amountOutMin",
            type: "uint256"
        }, {
            name: "routes",
            type: "tuple[]",
            components: [{
                name: "from",
                type: "address"
            }, {
                name: "to",
                type: "address"
            }, {
                name: "stable",
                type: "bool"
            }, {
                name: "factory",
                type: "address"
            }]
        }, {
            name: "to",
            type: "address"
        }, {
            name: "deadline",
            type: "uint256"
        }],
        name: "swapExactETHForTokens",
        outputs: [{
            name: "amounts",
            type: "uint256[]"
        }],
        stateMutability: "payable",
        type: "function"
    }, {
        inputs: [{
            name: "amountIn",
            type: "uint256"
        }, {
            name: "amountOutMin",
            type: "uint256"
        }, {
            name: "routes",
            type: "tuple[]",
            components: [{
                name: "from",
                type: "address"
            }, {
                name: "to",
                type: "address"
            }, {
                name: "stable",
                type: "bool"
            }, {
                name: "factory",
                type: "address"
            }]
        }, {
            name: "to",
            type: "address"
        }, {
            name: "deadline",
            type: "uint256"
        }],
        name: "swapExactTokensForETH",
        outputs: [{
            name: "amounts",
            type: "uint256[]"
        }],
        stateMutability: "nonpayable",
        type: "function"
    }, {
        inputs: [{
            name: "amountIn",
            type: "uint256"
        }, {
            name: "routes",
            type: "tuple[]",
            components: [{
                name: "from",
                type: "address"
            }, {
                name: "to",
                type: "address"
            }, {
                name: "stable",
                type: "bool"
            }, {
                name: "factory",
                type: "address"
            }]
        }],
        name: "getAmountsOut",
        outputs: [{
            name: "amounts",
            type: "uint256[]"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "weth",
        outputs: [{
            name: "",
            type: "address"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "defaultFactory",
        outputs: [{
            name: "",
            type: "address"
        }],
        stateMutability: "view",
        type: "function"
    }]
      , C = [{
        anonymous: !1,
        inputs: [{
            indexed: !0,
            name: "sender",
            type: "address"
        }, {
            indexed: !0,
            name: "to",
            type: "address"
        }, {
            indexed: !1,
            name: "amount0In",
            type: "uint256"
        }, {
            indexed: !1,
            name: "amount1In",
            type: "uint256"
        }, {
            indexed: !1,
            name: "amount0Out",
            type: "uint256"
        }, {
            indexed: !1,
            name: "amount1Out",
            type: "uint256"
        }],
        name: "Swap",
        type: "event"
    }, {
        inputs: [],
        name: "token0",
        outputs: [{
            name: "",
            type: "address"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "token1",
        outputs: [{
            name: "",
            type: "address"
        }],
        stateMutability: "view",
        type: "function"
    }]
      , E = {
        local: {
            rpcUrl: t.default.env.NEXT_PUBLIC_LOCAL_RPC_URL || k.localhost.rpcUrl,
            chainId: k.localhost.chainId,
            chain: s,
            factoryAddress: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
            aerodromeRouter: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
            aerodromeFactory: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
            weth: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
            blockExplorer: k.localhost.blockExplorer,
            chainlinkEthUsd: k.localhost.chainlink.proxy,
            chainlinkRpcUrl: "https://base-sepolia.g.alchemy.com/v2/BSGIw7Dzoif4m6DT-UYOa",
            subgraphUrl: null
        },
        localFork: {
            rpcUrl: t.default.env.NEXT_PUBLIC_LOCAL_RPC_URL || k.localFork.rpcUrl,
            chainId: k.localFork.chainId,
            chain: p.base,
            factoryAddress: "0x36aa04C4281E7ddA51FF2C2711dd12C4f1685Fd1",
            aerodromeRouter: k.localFork.aerodromeRouter,
            aerodromeFactory: k.localFork.aerodromeFactory,
            weth: k.localFork.weth,
            blockExplorer: k.localFork.blockExplorer,
            chainlinkEthUsd: k.localFork.chainlink.proxy,
            subgraphUrl: null
        },
        testnet: {
            rpcUrl: "https://base-sepolia.g.alchemy.com/v2/BSGIw7Dzoif4m6DT-UYOa",
            chainId: k.baseSepolia.chainId,
            chain: l.baseSepolia,
            factoryAddress: "0x9cEcC80AD70a69711a6BbB6842c1509c02A2Dd06",
            aerodromeRouter: "0x1c08d3722b19f16A7bA69Ad5814e2a514A83524A",
            aerodromeFactory: "0x8D8C738cC8f30f5D025E62D3c1B9e51e6eD13f77",
            weth: "0x8EA7Ce7Be0c1E3425e85103a1A76a105f952fA92",
            blockExplorer: k.baseSepolia.blockExplorer,
            chainlinkEthUsd: k.baseSepolia.chainlink.proxy,
            subgraphUrl: "https://api.goldsky.com/api/public/project_cmjjrebt3mxpt01rm9yi04vqq/subgraphs/pump-charts-sepolia/v2/gn"
        },
        mainnet: {
            rpcUrl: "https://base-mainnet.g.alchemy.com/v2/BSGIw7Dzoif4m6DT-UYOa",
            chainId: k.base.chainId,
            chain: p.base,
            factoryAddress: "0x07DFAEC8e182C5eF79844ADc70708C1c15aA60fb",
            aerodromeRouter: "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43",
            aerodromeFactory: "0x420DD381b31aEf6683db6B902084cB0FFECe40Da",
            weth: "0x4200000000000000000000000000000000000006",
            blockExplorer: k.base.blockExplorer,
            chainlinkEthUsd: k.base.chainlink.proxy,
            subgraphUrl: "https://api.goldsky.com/api/public/project_cmjjrebt3mxpt01rm9yi04vqq/subgraphs/pump-charts/v2/gn"
        }
    };
    function T(e, t) {
        if (null === t)
            return null;
        let n = Number((0,
        o.formatEther)(e)) * t;
        return n >= 1e6 ? `$${(n / 1e6).toFixed(2)}M` : n >= 1e3 ? `$${(n / 1e3).toFixed(2)}K` : `$${n.toFixed(2)}`
    }
    let F = {
        ...E[w],
        get chain() {
            return E[w].chain
        }
    };
    if (!F.rpcUrl)
        throw Error(`Missing required environment variable: NEXT_PUBLIC_BASE_RPC_URL
Add your Alchemy RPC URL to .env for ${w} mode.`);
    function N(e) {
        let t = F.blockExplorer;
        return t ? `${t}/tx/${e}` : null
    }
    function M(e) {
        let t = F.blockExplorer;
        return t ? `${t}/address/${e}` : null
    }
    function I(e, t="medium") {
        if (!e)
            return "";
        switch (t) {
        case "short":
            return e.slice(-6);
        case "medium":
        default:
            return `${e.slice(0, 6)}...${e.slice(-4)}`;
        case "long":
            return `${e.slice(0, 8)}...${e.slice(-6)}`
        }
    }
    function $(e) {
        let t = Math.floor((new Date().getTime() - e.getTime()) / 1e3)
          , n = Math.floor(t / 60)
          , a = Math.floor(n / 60)
          , r = Math.floor(a / 24);
        return t < 60 ? `${t}s ago` : n < 60 ? `${n}m ago` : a < 24 ? `${a}h ago` : `${r}d ago`
    }
    function B() {
        return (0,
        n.createPublicClient)({
            chain: F.chain,
            transport: (0,
            a.http)(F.rpcUrl)
        })
    }
    function D() {
        return !1
    }
    function R() {
        return !0
    }
    function O() {
        return !1
    }
    function U() {
        switch (w) {
        case "mainnet":
            return "Base Mainnet";
        case "testnet":
            return "Base Sepolia";
        case "localFork":
            return "Base Fork (Local)";
        case "local":
            return "Hardhat Local"
        }
    }
    async function P(e) {
        if (!e)
            return null;
        try {
            let t = function(e) {
                if (!e)
                    return "";
                if (e.startsWith("ipfs://")) {
                    let t = e.replace("ipfs://", "");
                    return `${b}${t}`
                }
                return e
            }(e);
            console.log(`[METADATA] Fetching: uri=${e} gatewayUrl=${t}`);
            let n = await fetch(t);
            if (console.log(`[METADATA] Response: status=${n.status} ok=${n.ok}`),
            !n.ok)
                return console.error(`[METADATA] Failed to fetch: status=${n.status} statusText=${n.statusText}`),
                null;
            let a = await n.json();
            return console.log(`[METADATA] Parsed: name=${a.name} image=${a.image} hasImage=${!!a.image}`),
            a
        } catch (e) {
            return console.error("[METADATA] Error:", e),
            null
        }
    }
    function L(e) {
        return (0,
        o.formatEther)(e)
    }
    function S(e, t=18) {
        return (0,
        i.formatUnits)(e, t)
    }
    async function _(e) {
        let t = B()
          , [n,a,r] = await Promise.all([t.readContract({
            address: e,
            abi: x,
            functionName: "getCurveInfo"
        }), t.readContract({
            address: e,
            abi: x,
            functionName: "createdAt"
        }), t.readContract({
            address: F.factoryAddress,
            abi: v,
            functionName: "curveCreator",
            args: [e]
        })]);
        return {
            curveAddress: e,
            tokenAddress: n[0],
            name: n[1],
            symbol: n[2],
            uri: n[3],
            currentPrice: n[4],
            marketCap: n[5],
            virtualEthReserve: n[6],
            virtualTokenReserve: n[7],
            tokensAvailable: n[8],
            createdAt: new Date(1e3 * Number(a)),
            creator: r
        }
    }
    async function H(e) {
        let t = B();
        try {
            let n = await t.readContract({
                address: F.factoryAddress,
                abi: v,
                functionName: "tokenToCurve",
                args: [e]
            });
            if ("0x0000000000000000000000000000000000000000" === n)
                return null;
            return await _(n)
        } catch (e) {
            return console.error("Failed to resolve token address via RPC:", e),
            null
        }
    }
    async function G() {
        let e = B()
          , t = await e.readContract({
            address: F.factoryAddress,
            abi: v,
            functionName: "totalCurves"
        });
        return await e.readContract({
            address: F.factoryAddress,
            abi: v,
            functionName: "getCurves",
            args: [0n, t]
        })
    }
    async function q(e, t) {
        let n = B()
          , a = Number(await n.readContract({
            address: F.factoryAddress,
            abi: v,
            functionName: "totalCurves"
        }));
        if (0 === a || e >= a)
            return {
                curves: [],
                hasMore: !1
            };
        let r = a - e
          , o = Math.max(0, r - t);
        return {
            curves: [...await n.readContract({
                address: F.factoryAddress,
                abi: v,
                functionName: "getCurves",
                args: [BigInt(o), BigInt(r - o)]
            })].reverse(),
            hasMore: o > 0
        }
    }
    async function j(e, t) {
        return B().readContract({
            address: e,
            abi: x,
            functionName: "getEthForTokens",
            args: [t]
        })
    }
    async function V(e, t) {
        let n = B();
        return await n.readContract({
            address: e,
            abi: x,
            functionName: "getEthRequiredForTokens",
            args: [t]
        })
    }
    async function W(e) {
        return B().readContract({
            address: e,
            abi: x,
            functionName: "getCurrentPrice"
        })
    }
    async function K(e) {
        return B().readContract({
            address: e,
            abi: x,
            functionName: "getMarketCap"
        })
    }
    async function z() {
        try {
            let e = B();
            return await e.getBlockNumber(),
            !0
        } catch {
            return !1
        }
    }
    function Y(e) {
        let t = Number((0,
        o.formatEther)(e));
        return t >= 1e6 ? `${(t / 1e6).toFixed(2)}M ETH` : t >= 1e3 ? `${(t / 1e3).toFixed(2)}k ETH` : t >= 1 ? `${t.toFixed(2)} ETH` : `${t.toFixed(4)} ETH`
    }
    async function J(e, t) {
        1;
        return X(e)
    }
    async function X(e) {
        let t = F.subgraphUrl;
        if (!t)
            return console.warn("No subgraph URL configured, falling back to empty"),
            [];
        let n = `
    query GetTrades($curve: ID!) {
      trades(
        where: { curve: $curve }
        orderBy: timestamp
        orderDirection: asc
        first: 1000
      ) {
        id
        side
        trader
        amountEth
        amountToken
        priceEth
        timestamp
        txHash
        blockNumber
      }
    }
  `;
        try {
            let a = await fetch(t, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query: n,
                    variables: {
                        curve: e.toLowerCase()
                    }
                })
            });
            if (!a.ok)
                throw Error("Subgraph request failed");
            let r = await a.json();
            return (r.data?.trades || []).map( (e, t) => ({
                type: e.side.toLowerCase(),
                trader: e.trader,
                ethAmount: BigInt(Math.floor(1e18 * Number(e.amountEth))),
                tokenAmount: BigInt(Math.floor(1e18 * Number(e.amountToken))),
                price: BigInt(Math.floor(1e18 * Number(e.priceEth))),
                blockNumber: BigInt(e.blockNumber),
                logIndex: t,
                transactionHash: e.txHash,
                timestamp: Number(e.timestamp)
            }))
        } catch (e) {
            return console.error("Failed to fetch trades from subgraph:", e),
            []
        }
    }
    async function Z(e, t) {
        let n = B()
          , a = await n.getBlockNumber()
          , r = t ?? (a > 50000n ? a - 50000n : 0n)
          , [o,i] = await Promise.all([n.getLogs({
            address: e,
            event: {
                type: "event",
                name: "TokensPurchased",
                inputs: [{
                    type: "address",
                    name: "buyer",
                    indexed: !0
                }, {
                    type: "uint256",
                    name: "ethIn"
                }, {
                    type: "uint256",
                    name: "tokensOut"
                }, {
                    type: "uint256",
                    name: "newPrice"
                }]
            },
            fromBlock: r,
            toBlock: a
        }), n.getLogs({
            address: e,
            event: {
                type: "event",
                name: "TokensSold",
                inputs: [{
                    type: "address",
                    name: "seller",
                    indexed: !0
                }, {
                    type: "uint256",
                    name: "tokensIn"
                }, {
                    type: "uint256",
                    name: "ethOut"
                }, {
                    type: "uint256",
                    name: "newPrice"
                }]
            },
            fromBlock: r,
            toBlock: a
        })])
          , u = [];
        try {
            let t = await n.readContract({
                address: e,
                abi: x,
                functionName: "getGraduationInfo"
            })
              , o = t[0]
              , i = t[4];
            if (o && i && "0x0000000000000000000000000000000000000000" !== i) {
                let e = (await n.readContract({
                    address: i,
                    abi: C,
                    functionName: "token0"
                })).toLowerCase() === F.weth.toLowerCase();
                u = (await n.getLogs({
                    address: i,
                    event: {
                        type: "event",
                        name: "Swap",
                        inputs: [{
                            type: "address",
                            name: "sender",
                            indexed: !0
                        }, {
                            type: "address",
                            name: "to",
                            indexed: !0
                        }, {
                            type: "uint256",
                            name: "amount0In"
                        }, {
                            type: "uint256",
                            name: "amount1In"
                        }, {
                            type: "uint256",
                            name: "amount0Out"
                        }, {
                            type: "uint256",
                            name: "amount1Out"
                        }]
                    },
                    fromBlock: r,
                    toBlock: a
                })).map(t => {
                    let[n,a,r,o] = [t.args.amount0In, t.args.amount1In, t.args.amount0Out, t.args.amount1Out]
                      , i = e ? n : a
                      , u = i > 0n
                      , s = u ? i : e ? r : o
                      , p = u ? e ? o : r : e ? a : n
                      , l = p > 0n ? s * BigInt(1e18) / p : 0n;
                    return {
                        type: u ? "buy" : "sell",
                        trader: t.args.sender,
                        ethAmount: s,
                        tokenAmount: p,
                        price: l,
                        blockNumber: t.blockNumber,
                        logIndex: t.logIndex,
                        transactionHash: t.transactionHash,
                        timestamp: void 0
                    }
                }
                )
            }
        } catch (e) {
            console.warn("[TRADES] Failed to fetch graduation info or pool swaps:", e)
        }
        let s = [...new Set([...[...o, ...i].map(e => e.blockNumber), ...u.map(e => e.blockNumber)])]
          , p = new Map;
        return await Promise.all(s.map(async e => {
            try {
                let t = await n.getBlock({
                    blockNumber: e
                });
                p.set(e, Number(t.timestamp))
            } catch {
                p.set(e, Math.floor(Date.now() / 1e3))
            }
        }
        )),
        [...o.map(e => ({
            type: "buy",
            trader: e.args.buyer,
            ethAmount: e.args.ethIn,
            tokenAmount: e.args.tokensOut,
            price: e.args.newPrice,
            blockNumber: e.blockNumber,
            logIndex: e.logIndex,
            transactionHash: e.transactionHash,
            timestamp: p.get(e.blockNumber)
        })), ...i.map(e => ({
            type: "sell",
            trader: e.args.seller,
            ethAmount: e.args.ethOut,
            tokenAmount: e.args.tokensIn,
            price: e.args.newPrice,
            blockNumber: e.blockNumber,
            logIndex: e.logIndex,
            transactionHash: e.transactionHash,
            timestamp: p.get(e.blockNumber)
        })), ...u.map(e => ({
            ...e,
            timestamp: p.get(e.blockNumber)
        }))].sort( (e, t) => e.blockNumber !== t.blockNumber ? Number(e.blockNumber - t.blockNumber) : e.logIndex - t.logIndex)
    }
    async function Q(e, t=50) {
        1;
        return ee(e, t)
    }
    async function ee(e, t) {
        let n = F.subgraphUrl;
        if (!n)
            return [];
        let a = `
    query GetTrades($curve: ID!, $limit: Int!) {
      trades(
        where: { curve: $curve }
        orderBy: timestamp
        orderDirection: desc
        first: $limit
      ) {
        side
        trader
        amountEth
        amountToken
        timestamp
        txHash
      }
    }
  `;
        try {
            let r = await fetch(n, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query: a,
                    variables: {
                        curve: e.toLowerCase(),
                        limit: t
                    }
                })
            });
            if (!r.ok)
                throw Error(`Subgraph request failed: ${r.statusText}`);
            let o = await r.json();
            return (o.data?.trades || []).map(e => ({
                type: e.side.toLowerCase(),
                trader: e.trader,
                ethAmount: e.amountEth,
                tokenAmount: m(Number(e.amountToken)),
                timestamp: new Date(1e3 * Number(e.timestamp)),
                txHash: e.txHash
            }))
        } catch (e) {
            throw e
        }
    }
    async function et(e, t) {
        let n, a = B(), r = await _(e), o = r.currentPrice, i = await J(e), u = 0n, s = 0n, p = 0n, l = 0n;
        for (let e of i)
            "buy" === e.type ? (u += e.ethAmount,
            p += e.tokenAmount) : (s += e.ethAmount,
            l += e.tokenAmount);
        let m = r.virtualEthReserve - u + s
          , c = r.virtualTokenReserve + p - l
          , d = c > 0n ? m * BigInt(1e18) / c : t;
        if (0 === i.length)
            return {
                change24h: 0,
                changeFromStart: 0,
                oldPrice: o,
                currentPrice: o,
                tradesIn24h: 0,
                volume24h: 0n
            };
        let y = o > d ? Number((o - d) * 10000n / d) / 100 : -Number((d - o) * 10000n / d) / 100
          , b = await a.getBlockNumber()
          , f = b > 7200n ? b - 7200n : 0n
          , h = i.filter(e => e.blockNumber <= f)
          , g = i.filter(e => e.blockNumber > f)
          , k = (n = h.length > 0 ? h[h.length - 1].price : d) > 0n ? o > n ? Number((o - n) * 10000n / n) / 100 : -Number((n - o) * 10000n / n) / 100 : 0
          , w = g.reduce( (e, t) => e + t.ethAmount, 0n);
        return {
            change24h: k,
            changeFromStart: y,
            oldPrice: n,
            currentPrice: o,
            tradesIn24h: g.length,
            volume24h: w
        }
    }
    async function en(e) {
        let t = B()
          , n = await t.readContract({
            address: e,
            abi: x,
            functionName: "getGraduationInfo"
        })
          , a = Number(n[1]) / 1e18;
        return {
            graduated: n[0],
            progress: Math.min(a, 100),
            ethCollected: n[2],
            ethThreshold: n[3],
            pool: "0x0000000000000000000000000000000000000000" === n[4] ? null : n[4],
            graduatedAt: n[5] > 0n ? new Date(1e3 * Number(n[5])) : null,
            lpTokensBurned: n[6]
        }
    }
    async function ea(e, t) {
        let n = B()
          , a = (0,
        r.parseEther)(t)
          , o = await n.readContract({
            address: e,
            abi: x,
            functionName: "simulateBuy",
            args: [a]
        });
        return {
            ethToUse: o[0],
            tokensOut: o[1],
            refundAmount: o[2],
            willGraduate: o[3],
            isPartialFill: o[2] > 0n
        }
    }
    async function er(e, t, n) {
        let[a,r,o] = await Promise.all([J(e), W(e), K(e)])
          , i = t;
        for (let e of a)
            e.price > i && (i = e.price);
        r > i && (i = r);
        let u = i * n / BigInt(1e18)
          , s = 98n * i / 100n
          , p = i > 0n && r < i ? Number((i - r) * 10000n / i) / 100 : 0;
        return {
            athMarketCap: u,
            athPrice: i,
            currentMarketCap: o,
            currentPrice: r,
            isAtATH: r >= s,
            percentFromATH: p
        }
    }
    async function eo(e, t) {
        B();
        let n = await W(e)
          , a = []
          , r = !1;
        1;
        {
            let n = F.subgraphUrl;
            if (n)
                try {
                    let o = `
          query GetUserTrades($curve: ID!, $trader: Bytes!) {
            trades(
              where: { curve: $curve, trader: $trader }
              orderBy: blockNumber
              orderDirection: asc
              first: 1000
            ) {
              side
              amountEth
              amountToken
              blockNumber
              logIndex
            }
          }
        `
                      , i = await fetch(n, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            query: o,
                            variables: {
                                curve: e.toLowerCase(),
                                trader: t.toLowerCase()
                            }
                        })
                    });
                    if (!i.ok)
                        throw Error(`Subgraph request failed: ${i.statusText}`);
                    let s = await i.json();
                    if (s.errors)
                        throw Error(s.errors[0]?.message || "Subgraph query error");
                    (a = (s.data?.trades || []).map(e => ({
                        type: e.side.toLowerCase(),
                        ethAmount: (0,
                        u.parseUnits)(e.amountEth, 18),
                        tokenAmount: (0,
                        u.parseUnits)(e.amountToken, 18),
                        blockNumber: BigInt(e.blockNumber),
                        logIndex: parseInt(e.logIndex)
                    }))).sort( (e, t) => e.blockNumber !== t.blockNumber ? Number(e.blockNumber - t.blockNumber) : e.logIndex - t.logIndex),
                    r = a.some(e => "buy" === e.type)
                } catch (e) {
                    console.error("Failed to fetch user trades from subgraph:", e)
                }
        }
        let o = function(e) {
            let t = 0n
              , n = 0n
              , a = 0n
              , r = 0n;
            for (let o of e)
                "buy" === o.type ? (t += o.ethAmount,
                a += o.tokenAmount) : (n += o.ethAmount,
                r += o.tokenAmount);
            return {
                totalEthSpent: t,
                totalEthReceived: n,
                totalTokensBought: a,
                totalTokensSold: r
            }
        }(a)
          , i = function(e, t) {
            let {totalEthSpent: n, totalEthReceived: a, totalTokensBought: r, totalTokensSold: o} = e
              , i = r - o
              , u = i * t / BigInt(1e18)
              , s = u + a - n
              , p = n > 0n ? Number(10000n * s / n) / 100 : 0;
            return {
                tokenBalance: i,
                totalEthSpent: n,
                totalEthReceived: a,
                currentValue: u,
                profitLoss: s,
                profitLossPercent: p
            }
        }(o, n)
          , s = o.totalTokensBought > 0n ? o.totalEthSpent * BigInt(1e18) / o.totalTokensBought : 0n;
        return {
            tokenBalance: i.tokenBalance,
            tokenBalanceFormatted: S(i.tokenBalance),
            avgBuyPrice: s,
            totalEthSpent: i.totalEthSpent,
            currentValue: i.currentValue,
            profitLoss: i.profitLoss,
            profitLossPercent: i.profitLossPercent,
            hasBuys: r
        }
    }
    async function ei() {
        return B().readContract({
            address: F.factoryAddress,
            abi: v,
            functionName: "getInitialVirtualToken"
        })
    }
    e.s(["AERODROME_ROUTER_ABI", 0, A, "BONDING_CURVE_ABI", 0, x, "CONTRACT_CONFIG", 0, F, "FACTORY_ABI", 0, v, "NETWORK_MODE", 0, w, "TOKEN_ABI", 0, [{
        inputs: [{
            name: "account",
            type: "address"
        }],
        name: "balanceOf",
        outputs: [{
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [{
            name: "spender",
            type: "address"
        }, {
            name: "amount",
            type: "uint256"
        }],
        name: "approve",
        outputs: [{
            name: "",
            type: "bool"
        }],
        stateMutability: "nonpayable",
        type: "function"
    }, {
        inputs: [{
            name: "owner",
            type: "address"
        }, {
            name: "spender",
            type: "address"
        }],
        name: "allowance",
        outputs: [{
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "totalSupply",
        outputs: [{
            name: "",
            type: "uint256"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "name",
        outputs: [{
            name: "",
            type: "string"
        }],
        stateMutability: "view",
        type: "function"
    }, {
        inputs: [],
        name: "symbol",
        outputs: [{
            name: "",
            type: "string"
        }],
        stateMutability: "view",
        type: "function"
    }], "checkConnection", () => z, "fetchTokenMetadata", () => P, "formatAddress", () => I, "formatEthValue", () => L, "formatMarketCap", () => Y, "formatMarketCapUsd", () => T, "formatTimeAgo", () => $, "formatTokenAmount", () => S, "getATHInfo", () => er, "getAllCurves", () => G, "getCurrentPrice", () => W, "getCurveInfo", () => _, "getCurvesPaginated", () => q, "getEthForTokens", () => j, "getEthRequiredForTokens", () => V, "getExplorerAddressUrl", () => M, "getExplorerTxUrl", () => N, "getGraduationInfo", () => en, "getInitialVirtualToken", () => ei, "getMarketCap", () => K, "getNetworkDisplayName", () => U, "getPriceChange", () => et, "getPublicClient", () => B, "getRecentTrades", () => Q, "getTradeEventsFromRpc", () => Z, "getUserPosition", () => eo, "isLocalNetwork", () => O, "isMainnet", () => R, "isTestnet", () => D, "resolveAddressToRpc", () => H, "simulateBuy", () => ea], 753519)
}
]);

//# debugId=93534aae-8bf6-e495-4fec-617cd87ae924
//# sourceMappingURL=9f7d5279bdb13135.js.map
