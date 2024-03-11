import * as zod from "zod";

const phaseSchema = zod.object({
  name: zod.string(),
  whitelist: zod.array(zod.string()).optional(),
  mint_price: zod.number().optional(),
  mints_per_user: zod.number().optional(),
  max_supply: zod.number().optional(),
  start_time: zod.coerce.date().optional(),
  end_time: zod.coerce.date().optional(),
});

export type Phase = zod.infer<typeof phaseSchema>;

const configSchema = zod.object({
  name: zod.string(),
  description: zod.string(),
  network: zod.enum(["injective-1", "injective-888", "injective-777"]),
  socials: zod
    .object({
      website: zod.string().optional(),
      twitter: zod.string().optional(),
      discord: zod.string().optional(),
      telegram: zod.string().optional(),
    })
    .optional(),
  registry: zod.string(),
  nft_contract: zod.string(),
  supply: zod.number(),
  phases: zod.array(phaseSchema),
});

export type Config = zod.infer<typeof configSchema>;

const config: Config = configSchema.parse({
  name: "Yakuza Collective",
  description:
    "Join the Yakuzas, where ancient ninja skills meet the vigilante justice of the night.",
  socials: {
    website: "",
    twitter: "",
    discord: "",
    telegram: "",
  },
  registry: "inj1ampmr86d7f28c9yywpdvcdpnzsvn6vqkkerq78",
  nft_contract: "inj1drqpzpnzmwxhhd388cl45ecjurf2jcqx2rqm8c",
  supply: 50,
  network: "injective-888",
  phases: [
    {
      name: "OG",
      mint_price: 1,
      mints_per_user: 3,
      max_supply: 10,
      start_time: "2024-03-03T02:00:00.000Z",
      end_time: "2024-03-03T04:00:00.000Z",
      whitelist: [
        "inj13tewqjkn50kehd0eyjaeeh39cxtk7satxzwpnv",
        "inj1y79yham5atltxkn49zvj6cazyaf3xs08qlaese",
        "inj133wcy5gfvlcgqaul5f0hxnlt4s86m8ykxq6vwg",
        "inj1j3jrn3s9p99ysk7jj05vtae73lvdqzlfcthax2",
        "inj12zzk8al6adpkgkhr3f47ard2ue5nm0n9cd6u68",
        "inj1lsz0cv8zl2ja3nu0wslhy2g4ajhsply773td00",
        "inj1p0atkg73sfccqg7v32xafmfkx8tjs6w3vaydxv",
      ],
    },
    {
      name: "whitelist",
      mint_price: 1.5,
      mints_per_user: 2,
      max_supply: 10,
      start_time: "2024-03-03T04:00:00.000Z",
      end_time: "2024-03-03T10:00:00.000Z",
      whitelist: [
        "inj1tru54rs5eggwtsq47xzlerclsex9px9kmh0t6q",
        "inj147wwpdcx4sa3nxaj26223ympxh2p5rm8ak0dvj",
        "inj195pujz4rvqy4j4ccsm9xdaf9c2destjnsqwxxp",
        "inj1szj02jdu3sqzrcyrla8gn3wchdfavw72lxegay",
        "inj14xmuz0sr2uua0j2w6fdr8pk8gz2yt780x28cr7",
        "inj1kdwz3vuu43w86h4vdsxhuql43f6aqj93pygknf",
        "inj1mwkjlxfgh8m809hds9awtqwlrtnt5dwcsst7yg",
        "inj1ctx80sxsp6vvy97w5helu0ta95fd8sfyr94zte",
        "inj1zpxkzdf9w5vu0e4ey95t9e6nde7m7kxxuspm9k",
        "inj1yaf0r2f5nlpsrqq3w3fjtlc9wfeeraze27lv2y",
      ],
    },
    {
      name: "public",
      mint_price: 2,
      start_time: "2024-03-03T10:00:00.000Z",
    },
  ],
});

export default config;
