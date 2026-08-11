const express=require("express");
const {Client,GatewayIntentBits}=require("discord.js");

const {DISCORD_TOKEN,WAVE_CHANNEL_ID,UPDATE_SECRET,SEASON_START}=process.env;
const PORT=process.env.PORT||3000;
if(!DISCORD_TOKEN||!WAVE_CHANNEL_ID||!UPDATE_SECRET||!SEASON_START){
  console.error("DISCORD_TOKEN, WAVE_CHANNEL_ID, UPDATE_SECRET och SEASON_START måste finnas.");
  process.exit(1);
}

const RULES={
  HUMAN:{second:12,third:22,sv:"Människa"},
  ELF:{second:1,third:16,sv:"Alv"},
  DWARF:{second:12,third:22,sv:"Dvärg"},
  ORC:{second:12,third:23,sv:"Ork"},
  GOBLIN:{second:12,third:25,sv:"Goblin"},
  TROLL:{second:12,third:23,sv:"Troll"},
  SALAMANTH:{second:12,third:25,sv:"Salamanth"}
};

const client=new Client({intents:[GatewayIntentBits.Guilds]});
const app=express();
app.use(express.text({type:"*/*",limit:"500kb"}));

app.get("/",(_,res)=>res.send("Lanista Våg-bot är online."));
app.get("/health",(_,res)=>res.json({ok:true,discordReady:client.isReady()}));

function dateOnly(v){
  const d=new Date(v);
  if(Number.isNaN(d.getTime()))return null;
  return new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()));
}
function addDays(d,n){const x=new Date(d);x.setUTCDate(x.getUTCDate()+n);return x}
function key(d){return d.toISOString().slice(0,10)}
function season(){const d=dateOnly(SEASON_START);if(!d)throw new Error("SEASON_START måste vara YYYY-MM-DD");return d}

function classify(member,start){
  const a=member?.avatar;
  if(!a?.name||!a?.created_at||!a?.race?.name)return null;
  const rule=RULES[String(a.race.name).toUpperCase()];
  if(!rule)return null;
  const created=dateOnly(a.created_at); if(!created)return null;
  const second=addDays(start,rule.second), third=addDays(start,rule.third);
  let wave=null;
  if(created>=second&&created<third)wave="second";
  else if(created>=third)wave="third";
  else return null;
  return {
    name:String(a.name),race:rule.sv,
    level:String(a.display_level??a.current_level??""),
    createdAt:key(created),wave
  };
}

function sortMembers(a){return a.sort((x,y)=>new Date(x.createdAt)-new Date(y.createdAt)||x.name.localeCompare(y.name,"sv"))}

function section(title,members){
  const out=[`🌊 **${title}**`];
  if(!members.length){out.push("_Inga klanmedlemmar i denna våg._");return out}
  members.forEach((m,i)=>out.push(`**${i+1}. ${m.name}** — ${m.race} — **Grad ${m.level||"?"}** — start ${m.createdAt}`));
  return out;
}

function message(payload){
  const start=season(), members=Array.isArray(payload.members)?payload.members:[];
  const c=members.map(m=>classify(m,start)).filter(Boolean);
  const second=sortMembers(c.filter(x=>x.wave==="second"));
  const third=sortMembers(c.filter(x=>x.wave==="third"));
  const lines=[
    "🌊 **HALVTIDSKRIGARNA – VÅGOR**","",
    `📅 **Säsongsstart:** ${key(start)}`,"",
    ...section("ANDRAVÅG",second),"",
    ...section("TREDJEVÅG",third),"",
    `**Andravåg:** ${second.length} gladiatorer`,
    `**Tredjevåg:** ${third.length} gladiatorer`
  ];
  const d=new Date(payload.updatedAt||Date.now());
  if(!Number.isNaN(d.getTime())){
    const stamp=new Intl.DateTimeFormat("sv-SE",{timeZone:"Europe/Stockholm",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}).format(d);
    lines.push(`_Senast uppdaterad: ${stamp}_`);
  }
  lines.push("_Våg bestäms av startdatum och ras. Grad hämtas från Lanista._");
  return lines.join("\n").slice(0,2000);
}

async function upsert(channel,content){
  try{
    const recent=await channel.messages.fetch({limit:100});
    const existing=recent.find(m=>m.author.id===client.user.id&&m.content.startsWith("🌊 **HALVTIDSKRIGARNA – VÅGOR**"));
    if(existing){await existing.edit({content,allowedMentions:{parse:[]}});return}
  }catch(e){console.warn("Kunde inte läsa tidigare meddelanden:",e.message)}
  await channel.send({content,allowedMentions:{parse:[]}});
}

app.post("/update",async(req,res)=>{
  try{
    let payload; try{payload=JSON.parse(req.body||"{}")}catch{return res.status(400).send("Ogiltig JSON")}
    if(payload.secret!==UPDATE_SECRET)return res.status(403).send("Fel secret");
    if(!client.isReady())return res.status(503).send("Discord är inte redo");
    if(!Array.isArray(payload.members))return res.status(400).send("members saknas");
    const channel=await client.channels.fetch(WAVE_CHANNEL_ID);
    if(!channel||!channel.isTextBased())return res.status(500).send("Fel kanal-ID");
    await upsert(channel,message(payload));
    console.log(`Våglistan uppdaterad från ${payload.members.length} klanmedlemmar.`);
    res.send("OK");
  }catch(e){console.error(e);res.status(500).send("Internt fel")}
});

client.once("ready",()=>{console.log(`Discord: inloggad som ${client.user.tag}`);console.log(`Säsongsstart: ${SEASON_START}`)});
client.login(DISCORD_TOKEN);
app.listen(PORT,"0.0.0.0",()=>console.log(`HTTP-server lyssnar på port ${PORT}`));