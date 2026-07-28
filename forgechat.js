(function(S) {
  'use strict';
  if (!S?.extensions) return console.error("ForgeChat environment error.");
  class ForgeChat {
    constructor() { this.chatbots = {}; this.currentResponse = ""; this.currentQuestion = ""; }
    getInfo() {
      const sArg = (d) => ({ type: S.ArgumentType.STRING, defaultValue: d }), lbl = (t) => ({ text: `--- ${t} ---`, blockType: S.BlockType.LABEL });
      return {
        id: 'forgechat', name: 'ForgeChat', color1: '#D93838', color2: '#A62424',
        blocks: [
          lbl('CHATBOT CREATION'),
          { opcode: 'createChatbot', blockType: S.BlockType.COMMAND, text: 'create Chatbot named [NAME]', arguments: { NAME: sArg('HelperBot') } },
          { opcode: 'deleteChatbot', blockType: S.BlockType.COMMAND, text: 'Delete Chatbot [NAME]', arguments: { NAME: sArg('HelperBot') } },
          lbl('CHATBOT KNOWLEDGE'),
          { opcode: 'setResponseMode', blockType: S.BlockType.COMMAND, text: 'Set Chatbot [NAME] Response Setting to [MODE]', arguments: { NAME: sArg('HelperBot'), MODE: { type: S.ArgumentType.STRING, menu: 'modeMenu' } } },
          { opcode: 'chatbotLearnFrom', blockType: S.BlockType.COMMAND, text: 'Chatbot [NAME] learn from [TEXT]', arguments: { NAME: sArg('HelperBot'), TEXT: sArg('My favorite color is blue') } },
          { opcode: 'setResponse', blockType: S.BlockType.COMMAND, text: 'Set Chatbot [NAME] response to [TRIGGER] Response: [RESPONSE]', arguments: { NAME: sArg('HelperBot'), TRIGGER: sArg('hello'), RESPONSE: sArg('Hey there!') } },
          { opcode: 'changeResponse', blockType: S.BlockType.COMMAND, text: 'Change Chatbot [NAME] response to [TRIGGER] Response: [RESPONSE]', arguments: { NAME: sArg('HelperBot'), TRIGGER: sArg('hello'), RESPONSE: sArg('What is up!') } },
          { opcode: 'setFallback', blockType: S.BlockType.COMMAND, text: 'Set/Change Chatbot [NAME] Fallback Response to [FALLBACK]', arguments: { NAME: sArg('HelperBot'), FALLBACK: sArg('I do not know that phrase.') } },
          lbl('CHATBOT MANAGEMENT'),
          { opcode: 'askChatbot', blockType: S.BlockType.REPORTER, text: 'Ask Chatbot [NAME] message [MESSAGE] and wait', arguments: { NAME: sArg('HelperBot'), MESSAGE: sArg('hello') } },
          { opcode: 'chatbotRememberPhraseCommand', blockType: S.BlockType.COMMAND, text: 'Chatbot [NAME] remember [PHRASE]', arguments: { NAME: sArg('HelperBot'), PHRASE: sArg('apples') } },
          { opcode: 'setMemorySystem', blockType: S.BlockType.COMMAND, text: 'Set Chatbot [NAME] Memory System to [STATUS]', arguments: { NAME: sArg('HelperBot'), STATUS: { type: S.ArgumentType.STRING, menu: 'statusMenu' } } },
          { opcode: 'setMemoryLimit', blockType: Scratch.BlockType.COMMAND, text: 'Set Chatbot [NAME] Memory Limit to [LIMIT]', arguments: { NAME: sArg('HelperBot'), LIMIT: { type: S.ArgumentType.NUMBER, defaultValue: 30 } } },
          { opcode: 'clearChatbotMemory', blockType: S.BlockType.COMMAND, text: 'Wipe all memories for Chatbot [NAME]', arguments: { NAME: sArg('HelperBot') } },
          { opcode: 'getChatbotResponse', blockType: S.BlockType.REPORTER, text: 'Chatbot Response' },
          { opcode: 'getPlayerQuestion', blockType: S.BlockType.REPORTER, text: 'Player Question' },
          { opcode: 'getMemoryCount', blockType: S.BlockType.REPORTER, text: 'Stored memories count for Chatbot [NAME]', arguments: { NAME: sArg('HelperBot') } },
          { opcode: 'chatbotRemembersPhrase', blockType: S.BlockType.BOOLEAN, text: 'Does Chatbot [NAME] remember the keyword [KEYWORD]', arguments: { NAME: sArg('HelperBot'), KEYWORD: sArg('apples') } },
          lbl('DATA BACKUP & MATH UTILITIES'),
          { opcode: 'exportMemory', blockType: S.BlockType.REPORTER, text: 'Export memory bank data string for Chatbot [NAME]', arguments: { NAME: sArg('HelperBot') } },
          { opcode: 'importMemory', blockType: S.BlockType.COMMAND, text: 'Import memory bank data string [DATA] into Chatbot [NAME]', arguments: { NAME: sArg('HelperBot'), DATA: sArg('') } },
          { opcode: 'chatbotCalculate', blockType: S.BlockType.REPORTER, text: 'Chatbot solve math equation [EQUATION]', arguments: { EQUATION: sArg('2 + 2 * 5') } },
          { opcode: 'chatbotCountWords', blockType: S.BlockType.REPORTER, text: 'Chatbot count words in text [TEXT]', arguments: { TEXT: sArg('Hello beautiful world!') } }
        ],
        menus: { statusMenu: { acceptReporters: true, items: ['on', 'off'] }, modeMenu: { acceptReporters: true, items: ['Pre-written', 'Custom', 'Custom+Pre-written'] } }
      };
    }
    createChatbot(a) {
      const n = String(a.NAME).trim(); if (!n || this.chatbots[n]) return;
      this.chatbots[n] = { mode: 'Pre-written', memory: true, limit: 30, bank: [], custom: {}, defaults: { 'hello': [`Hello! I am ${n}.`, 'Hi there!'], 'hi': ['Hi!', 'Hello!'], 'how are you': ['I am operating smoothly!'], 'bye': ['Goodbye!'] }, fallback: `I am ${n}. That phrase is not recognized.` };
    }
    deleteChatbot(a) { delete this.chatbots[String(a.NAME).trim()]; }
    setResponseMode(a) { const b = this.chatbots[String(a.NAME).trim()]; if (b) b.mode = String(a.MODE).trim(); }
    setMemorySystem(a) { const b = this.chatbots[String(a.NAME).trim()]; if (b) b.memory = String(a.STATUS).toLowerCase().trim() === 'on'; }
    setMemoryLimit(a) { const b = this.chatbots[String(a.NAME).trim()]; if (b) b.limit = Math.max(1, parseInt(a.LIMIT) || 10); }
    clearChatbotMemory(a) { const b = this.chatbots[String(a.NAME).trim()]; if (b) b.bank = []; }
    manageResponses(a, o) {
      const b = this.chatbots[String(a.NAME).trim()]; if (!b) return; const t = String(a.TRIGGER).toLowerCase().trim();
      b.custom[t] = o ? [String(a.RESPONSE).trim()] : (b.custom[t] || []).concat(String(a.RESPONSE).trim());
    }
    setResponse(a) { this.manageResponses(a, false); }
    changeResponse(a) { this.manageResponses(a, true); }
    setFallback(a) { const b = this.chatbots[String(a.NAME).trim()]; if (b) b.fallback = String(a.FALLBACK).trim(); }
    chatbotLearnFrom(a) {
      const b = this.chatbots[String(a.NAME).trim()]; if (!b?.memory) return; let txt = String(a.TEXT).toLowerCase().trim(), m = txt.match(/favorite\s+([a-z0-9]+)\s+is\s+([a-z0-9\s]+)/i);
      if (m) { const t = m[1].trim(), v = m[2].trim(); (b.custom[t] ??= []).push(`${v} sounds nice!`); b.custom[v] = [`Ah yes, your favorite ${t}!`]; txt = `you love ${v}`; }
      if (!b.bank.includes(txt)) b.bank.push(txt); if (b.bank.length > b.limit) b.bank.splice(0, 10);
    }
    sysCmd(c, b) {
      if (c === 'forge!forget') { if (b) b.bank = []; return "Memory wiped. I have completely forgotten everything."; }
      return c === 'forge!chatbots' ? `There are currently ${Object.keys(this.chatbots).length} active chatbots loaded in my system.` : null;
    }
    chatbotRememberPhraseCommand(a) {
      const b = this.chatbots[String(a.NAME).trim()], p = String(a.PHRASE).toLowerCase().trim(); this.currentQuestion = String(a.PHRASE).trim();
      const cmd = this.sysCmd(p, b); if (cmd !== null) return this.currentResponse = cmd;
      if (!b) return this.currentResponse = `Error: Chatbot "${a.NAME}" missing!`; if (!b.memory) return this.currentResponse = "My memory system is deactivated.";
      const f = b.bank.some(m => m.includes(p));
      this.currentResponse = f ? [`Yes, I remember ${a.PHRASE}!`, `I do remember ${a.PHRASE}!`, `I do remember ${a.PHRASE}.`][Math.floor(Math.random() * 3)] : ["sorry, I don't remember.", "I do not remember.", "sorry, I can't help with that, I don't remember.", "I don't remember."][Math.floor(Math.random() * 4)];
    }
    askChatbot(a) {
      const b = this.chatbots[String(a.NAME).trim()], msg = String(a.MESSAGE).trim(), c = msg.toLowerCase(); this.currentQuestion = msg;
      const cmd = this.sysCmd(c, b); if (cmd !== null) return this.currentResponse = cmd; if (!b) return `Error: Chatbot "${a.NAME}" missing!`;
      if (b.memory && c) { if (!b.bank.includes(c)) b.bank.push(c); if (b.bank.length > b.limit) b.bank.splice(0, 10); }
      let pool = {}; if (['Custom', 'Custom+Pre-written'].includes(b.mode)) Object.assign(pool, b.custom);
      if (['Pre-written', 'Custom+Pre-written'].includes(b.mode)) Object.entries(b.defaults).forEach(([k, v]) => pool[k] = (pool[k] || []).concat(v));
      const k = Object.keys(pool).find(k => c.includes(k)); if (k && pool[k].length) return this.currentResponse = pool[k][Math.floor(Math.random() * pool[k].length)];
      const past = b.bank.filter(m => m !== c); if (b.memory && past.length && Math.random() < 0.20) return this.currentResponse = `Earlier you mentioned '${past[Math.floor(Math.random() * past.length)]}'. Why did you bring that up?`;
      return this.currentResponse = b.fallback;
    }
    getChatbotResponse() { return this.currentResponse; }
    getPlayerQuestion() { return this.currentQuestion; }
    getMemoryCount(a) { return this.chatbots[String(a.NAME).trim()]?.bank.length || 0; }
    chatbotRemembersPhrase(a) { return !!this.chatbots[String(a.NAME).trim()]?.bank.some(m => m.includes(String(a.KEYWORD).toLowerCase().trim())); }
    exportMemory(a) { return this.chatbots[String(a.NAME).trim()]?.bank.map(encodeURIComponent).join('|') || ""; }
    importMemory(a) { const b = this.chatbots[String(a.NAME).trim()], d = String(a.DATA).trim(); if (b && d) try { b.bank = d.split('|').map(decodeURIComponent); } catch (e) {} }
    chatbotCalculate(a) { try { return Function(`"use strict"; return (${String(a.EQUATION).replace(/[^0-9+\-*/().\s]/g, '')})`)() ?? "Error"; } catch (e) { return "Math Error"; } }
    chatbotCountWords(a) { const t = String(a.TEXT).trim(); return t ? t.split(/\s+/).length : 0; }
  }
  S.extensions.register(new ForgeChat());
})(Scratch);
