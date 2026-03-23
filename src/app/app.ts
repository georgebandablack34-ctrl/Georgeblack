import { ChangeDetectionStrategy, Component, signal, Inject, PLATFORM_ID, computed } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { generateWorld, Club, Player, Fixture, MatchEvent } from './database';

type GameMode = 'setup' | 'manager' | 'player';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // World Data
  world = signal(generateWorld());
  
  // App State
  gameMode = signal<GameMode>('setup');
  activeTab = signal<string>('dashboard');
  isFullscreen = signal(false);
  notification = signal<string | null>(null);
  newsFeed = signal<string[]>([]);

  // Setup State
  setupPlayerName = signal('My Pro');
  setupPlayerPos = signal('ST');
  setupClubId = signal('');

  // Customize Club State
  customizeClubName = signal('');
  customizeClubLogo = signal('');

  // Shared State
  currentDateStr = signal('2025-08-09');
  season = signal('2025/2026');
  currentClubId = signal<string>('');
  
  // Manager State
  managerName = signal('G. Black');
  
  // Player Career State
  myPlayerId = signal<string>('');

  // Live Match State
  activeMatch = signal<Fixture | null>(null);
  matchMinute = signal(0);
  matchEvents = signal<MatchEvent[]>([]);
  isMatchPlaying = signal(false);
  manageContractPlayer = signal<Player | null>(null);
  contractOfferWage = signal(0);
  contractOfferYears = signal(1);
  contractOfferReleaseClause = signal(0);
  matchInterval: ReturnType<typeof setInterval> | undefined;

  // Lifestyle Items
  availableHouses = [
    { id: 'h1', name: 'Studio Apartment', price: 50000, icon: 'apartment', desc: 'A modest start in the city.' },
    { id: 'h2', name: 'Luxury Penthouse', price: 750000, icon: 'location_city', desc: 'Sky-high living with a view.' },
    { id: 'h3', name: 'Suburban Villa', price: 2500000, icon: 'house', desc: 'Spacious and private.' },
    { id: 'h4', name: 'Mega Mansion', price: 15000000, icon: 'castle', desc: 'The ultimate symbol of success.' }
  ];

  availableCars = [
    { id: 'c1', name: 'Compact Hatchback', price: 15000, icon: 'directions_car', desc: 'Reliable and economical.' },
    { id: 'c2', name: 'Luxury Sedan', price: 85000, icon: 'directions_car_filled', desc: 'Comfort and status.' },
    { id: 'c3', name: 'Sports Car', price: 300000, icon: 'sports_motorsports', desc: 'Speed and style.' },
    { id: 'c4', name: 'Hypercar', price: 2500000, icon: 'airport_shuttle', desc: 'Engineering perfection.' }
  ];

  availableAirplanes = [
    { id: 'a1', name: 'Light Aircraft', price: 1500000, icon: 'flight', desc: 'Perfect for quick regional trips.' },
    { id: 'a2', name: 'Private Jet', price: 12000000, icon: 'flight_takeoff', desc: 'Travel the world in absolute luxury.' },
    { id: 'a3', name: 'Jumbo Jet', price: 85000000, icon: 'airlines', desc: 'Your own personal airliner.' }
  ];

  availableBuses = [
    { id: 'b1', name: 'Touring Coach', price: 250000, icon: 'directions_bus', desc: 'Comfortable road travel.' },
    { id: 'b2', name: 'Luxury Motorhome', price: 1200000, icon: 'rv_hookup', desc: 'A mansion on wheels.' }
  ];

  availableYachts = [
    { id: 'y1', name: 'Speedboat', price: 2000000, icon: 'sailing', desc: 'Fast and fun on the water.' },
    { id: 'y2', name: 'Luxury Yacht', price: 15000000, icon: 'directions_boat', desc: 'A floating palace.' },
    { id: 'y3', name: 'Superyacht', price: 50000000, icon: 'directions_boat_filled', desc: 'The ultimate status symbol.' }
  ];

  // Computed Selectors
  currentClub = computed(() => this.world().clubs.find(c => c.id === this.currentClubId()));
  currentLeague = computed(() => this.world().leagues.find(l => l.id === this.currentClub()?.leagueId));
  clubSquad = computed(() => this.world().players.filter(p => p.clubId === this.currentClubId()).sort((a, b) => b.ovr - a.ovr));
  leagueTable = computed(() => {
    const leagueId = this.currentClub()?.leagueId;
    return this.world().clubs.filter(c => c.leagueId === leagueId).sort((a, b) => b.points - a.points || b.gd - a.gd);
  });
  myPlayer = computed(() => this.world().players.find(p => p.id === this.myPlayerId()));
  
  transferMarket = computed(() => this.world().players.filter(p => p.clubId !== this.currentClubId()).sort((a, b) => b.ovr - a.ovr).slice(0, 100));

  upcomingFixtures = computed(() => {
    const myClubId = this.currentClubId();
    return this.world().fixtures
      .filter(f => !f.played && (f.homeClubId === myClubId || f.awayClubId === myClubId))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
  });

  myNextFixture = computed(() => this.upcomingFixtures()[0] || null);

  uclFixtures = computed(() => {
    return this.world().fixtures.filter(f => f.competition.includes('UEFA Champions League'));
  });

  cwcFixtures = computed(() => {
    return this.world().fixtures.filter(f => f.competition.includes('Club World Cup'));
  });

  private platformId = Inject(PLATFORM_ID);

  constructor() {
    this.setupClubId.set(this.world().clubs[0].id);
  }

  getClub(id: string) {
    return this.world().clubs.find(c => c.id === id);
  }

  startGame(mode: 'manager' | 'player') {
    const clubId = this.setupClubId();
    this.currentClubId.set(clubId);
    this.gameMode.set(mode);
    
    if (mode === 'player') {
      const newPlayer: Player = {
        id: 'my_pro_1',
        clubId: clubId,
        name: this.setupPlayerName(),
        position: this.setupPlayerPos(),
        ovr: 45, // Start from the lowest overall
        pace: 50, shooting: 40, passing: 45, dribbling: 45, defending: 30, physical: 50,
        value: 50000,
        wage: 500,
        morale: 'Excellent',
        fitness: 100,
        age: 18,
        contractEndDate: `${new Date(this.currentDateStr()).getFullYear() + 3}-06-30`,
        releaseClause: 100000,
        renewalOption: true,
        bankBalance: 0,
        houses: [],
        cars: [],
        airplanes: [],
        buses: [],
        ownedClubs: []
      };
      this.world.update(w => ({
        ...w,
        players: [...w.players, newPlayer]
      }));
      this.myPlayerId.set('my_pro_1');
      this.activeTab.set('my-pro');
    } else {
      this.activeTab.set('dashboard');
    }
  }

  setTab(tab: string) {
    this.activeTab.set(tab);
  }

  openCustomizeTab() {
    this.customizeClubName.set(this.currentClub()?.name || '');
    this.customizeClubLogo.set(this.currentClub()?.logo || '');
    this.setTab('customize-club');
  }

  saveClubCustomization() {
    const myClub = this.currentClub();
    if (!myClub) return;
    
    const newName = this.customizeClubName() || myClub.name;
    const newLogo = this.customizeClubLogo() || myClub.logo;
    
    this.world.update(w => {
      const newClubs = w.clubs.map(c => c.id === myClub.id ? { ...c, name: newName, logo: newLogo } : c);
      return { ...w, clubs: newClubs };
    });
    
    this.showNotification('Club customized successfully!');
  }

  simulateToNextMatch() {
    const myNext = this.myNextFixture();
    if (!myNext) return;
    
    if (this.currentDateStr() === myNext.date) {
      this.showNotification("It's matchday! Play your match.");
      return;
    }

    let safety = 0;
    while (this.currentDateStr() !== myNext.date && safety < 30) {
      this.advanceDay(true);
      safety++;
    }
  }

  advanceDay(silent = false) {
    const today = this.currentDateStr();
    const fixturesToday = this.world().fixtures.filter(f => f.date === today && !f.played);
    
    const myFixture = fixturesToday.find(f => f.homeClubId === this.currentClubId() || f.awayClubId === this.currentClubId());
    
    if (myFixture && !myFixture.played) {
      if (!silent) this.showNotification("You have a match today! Play the match to advance.");
      return;
    }
    
    if (fixturesToday.length > 0) {
      this.simulateAIFixtures(fixturesToday);
    }
    
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    this.currentDateStr.set(d.toISOString().split('T')[0]);
    
    // Update Player Bank Balance (Daily Wage)
    if (this.gameMode() === 'player' && this.myPlayerId()) {
      this.world.update(w => {
        const newPlayers = w.players.map(p => {
          if (p.id === this.myPlayerId()) {
            return { ...p, bankBalance: (p.bankBalance || 0) + Math.floor(p.wage / 7) };
          }
          return p;
        });
        return { ...w, players: newPlayers };
      });
    }

    this.checkUCLProgression();
    this.checkCWCProgression();
    
    if (d.getDate() === 1) {
      this.processMonthlyUpdates();
    }
  }

  simulateAIFixtures(fixtures: Fixture[]) {
    this.world.update(w => {
      const newFixtures = [...w.fixtures];
      const newClubs = [...w.clubs];
      
      fixtures.forEach(f => {
        const homeClub = newClubs.find(c => c.id === f.homeClubId)!;
        const awayClub = newClubs.find(c => c.id === f.awayClubId)!;
        
        const homeAdv = 2;
        const homeStrength = homeClub.ovr + homeAdv + Math.random() * 20;
        const awayStrength = awayClub.ovr + Math.random() * 20;
        
        let homeScore = 0;
        let awayScore = 0;
        
        if (homeStrength > awayStrength + 10) { homeScore = Math.floor(Math.random()*3)+1; awayScore = Math.floor(Math.random()*2); }
        else if (awayStrength > homeStrength + 10) { awayScore = Math.floor(Math.random()*3)+1; homeScore = Math.floor(Math.random()*2); }
        else { homeScore = Math.floor(Math.random()*2); awayScore = Math.floor(Math.random()*2); }
        
        if (f.isKnockout && homeScore === awayScore) {
          if (Math.random() > 0.5) homeScore++; else awayScore++;
        }

        const fixIdx = newFixtures.findIndex(fix => fix.id === f.id);
        newFixtures[fixIdx] = { ...f, played: true, homeScore, awayScore };
        
        if (!f.isKnockout) {
           const hIdx = newClubs.findIndex(c => c.id === homeClub.id);
           const aIdx = newClubs.findIndex(c => c.id === awayClub.id);
           
           newClubs[hIdx] = { ...newClubs[hIdx], played: newClubs[hIdx].played + 1, points: newClubs[hIdx].points + (homeScore > awayScore ? 3 : homeScore === awayScore ? 1 : 0), gd: newClubs[hIdx].gd + (homeScore - awayScore) };
           newClubs[aIdx] = { ...newClubs[aIdx], played: newClubs[aIdx].played + 1, points: newClubs[aIdx].points + (awayScore > homeScore ? 3 : homeScore === awayScore ? 1 : 0), gd: newClubs[aIdx].gd + (awayScore - homeScore) };
        }
      });
      
      return { ...w, fixtures: newFixtures, clubs: newClubs };
    });
  }

  playMatch(fixture: Fixture) {
    this.activeMatch.set(fixture);
    this.matchMinute.set(0);
    this.matchEvents.set([]);
    this.isMatchPlaying.set(true);
    this.setTab('live-match');
    
    this.matchInterval = setInterval(() => {
      this.matchMinute.update(m => m + 1);
      this.simulateMatchMinute(fixture);
      
      if (this.matchMinute() >= 90) {
        if (fixture.isKnockout && this.activeMatch()!.homeScore === this.activeMatch()!.awayScore) {
          const homeClub = this.world().clubs.find(c => c.id === fixture.homeClubId)!;
          const awayClub = this.world().clubs.find(c => c.id === fixture.awayClubId)!;
          if (Math.random() > 0.5) this.scoreGoal(fixture, homeClub, 'home');
          else this.scoreGoal(fixture, awayClub, 'away');
        }
        clearInterval(this.matchInterval);
        this.isMatchPlaying.set(false);
      }
    }, 100);
  }

  simulateMatchMinute(fixture: Fixture) {
    const homeClub = this.world().clubs.find(c => c.id === fixture.homeClubId)!;
    const awayClub = this.world().clubs.find(c => c.id === fixture.awayClubId)!;
    
    const homeAdvantage = 2;
    const homeChance = 0.015 + ((homeClub.ovr + homeAdvantage - awayClub.ovr) * 0.001);
    const awayChance = 0.015 + ((awayClub.ovr - homeClub.ovr - homeAdvantage) * 0.001);
    
    const rand = Math.random();
    if (rand < homeChance) {
       this.scoreGoal(fixture, homeClub, 'home');
    } else if (rand < homeChance + awayChance) {
       this.scoreGoal(fixture, awayClub, 'away');
    } else if (rand < homeChance + awayChance + 0.005) {
       this.giveCard(fixture, homeClub, 'yellow_card');
    } else if (rand < homeChance + awayChance + 0.01) {
       this.giveCard(fixture, awayClub, 'yellow_card');
    } else if (rand < homeChance + awayChance + 0.011) {
       this.giveCard(fixture, homeClub, 'red_card');
    } else if (rand < homeChance + awayChance + 0.012) {
       this.giveCard(fixture, awayClub, 'red_card');
    }
  }

  giveCard(fixture: Fixture, club: Club, type: 'yellow_card' | 'red_card') {
    const players = this.world().players.filter(p => p.clubId === club.id);
    const player = players[Math.floor(Math.random() * players.length)];
    
    const event: MatchEvent = {
      minute: this.matchMinute(),
      type: type,
      player: player.name,
      club: club.name
    };
    
    this.matchEvents.update(e => [event, ...e]);

    if (this.gameMode() === 'player' && player.id === this.myPlayerId()) {
      if (type === 'red_card') {
        this.world.update(w => {
          const newPlayers = w.players.map(p => {
            if (p.id === this.myPlayerId()) {
              return { ...p, bankBalance: Math.max(0, (p.bankBalance || 0) - 2000), morale: 'Poor' };
            }
            return p;
          });
          return { ...w, players: newPlayers };
        });
        this.showNotification(`You received a red card! Fined €2,000.`);
      } else {
        this.world.update(w => {
          const newPlayers = w.players.map(p => {
            if (p.id === this.myPlayerId()) {
              return { ...p, morale: 'Okay' };
            }
            return p;
          });
          return { ...w, players: newPlayers };
        });
        this.showNotification(`You received a yellow card.`);
      }
    }
  }

  scoreGoal(fixture: Fixture, club: Club, side: 'home' | 'away') {
    const updatedFixture = { ...this.activeMatch()! };
    if (side === 'home') updatedFixture.homeScore++;
    else updatedFixture.awayScore++;
    
    const players = this.world().players.filter(p => p.clubId === club.id);
    const scorer = players[Math.floor(Math.random() * players.length)];
    
    const event: MatchEvent = {
      minute: this.matchMinute(),
      type: 'goal',
      player: scorer.name,
      club: club.name
    };
    
    this.matchEvents.update(e => [event, ...e]);
    this.activeMatch.set(updatedFixture);

    if (this.gameMode() === 'player' && scorer.id === this.myPlayerId()) {
      this.world.update(w => {
        const newPlayers = w.players.map(p => {
          if (p.id === this.myPlayerId()) {
            return { ...p, bankBalance: (p.bankBalance || 0) + 5000, morale: 'Excellent' };
          }
          return p;
        });
        return { ...w, players: newPlayers };
      });
      this.showNotification(`You scored a goal! €5,000 goal bonus added to your bank balance.`);
    }
  }

  closeMatch() {
    const fixture = this.activeMatch();
    if (!fixture) return;

    this.world.update(w => {
      const newFixtures = [...w.fixtures];
      const idx = newFixtures.findIndex(f => f.id === fixture.id);
      newFixtures[idx] = { ...fixture, played: true };
      
      const newClubs = [...w.clubs];
      if (!fixture.isKnockout) {
         const homeScore = fixture.homeScore;
         const awayScore = fixture.awayScore;
         const hIdx = newClubs.findIndex(c => c.id === fixture.homeClubId);
         const aIdx = newClubs.findIndex(c => c.id === fixture.awayClubId);
         
         newClubs[hIdx] = { ...newClubs[hIdx], played: newClubs[hIdx].played + 1, points: newClubs[hIdx].points + (homeScore > awayScore ? 3 : homeScore === awayScore ? 1 : 0), gd: newClubs[hIdx].gd + (homeScore - awayScore) };
         newClubs[aIdx] = { ...newClubs[aIdx], played: newClubs[aIdx].played + 1, points: newClubs[aIdx].points + (awayScore > homeScore ? 3 : homeScore === awayScore ? 1 : 0), gd: newClubs[aIdx].gd + (awayScore - homeScore) };
      }
      
      return { ...w, fixtures: newFixtures, clubs: newClubs };
    });

    this.activeMatch.set(null);
    this.setTab('dashboard');
    this.advanceDay();
  }

  checkUCLProgression() {
    const uclMatches = this.world().fixtures.filter(f => f.competition.includes('UEFA Champions League'));
    
    const checkRound = (currentRound: string, nextRound: string) => {
      const current = uclMatches.filter(f => f.competition.includes(currentRound));
      if (current.length > 0 && current.every(f => f.played)) {
        const next = uclMatches.filter(f => f.competition.includes(nextRound));
        if (next.length === 0) {
          this.generateNextUCLRound(current, nextRound);
        }
      }
    };

    checkRound('R16', 'Quarter-Final');
    checkRound('Quarter-Final', 'Semi-Final');
    checkRound('Semi-Final', 'Final');
  }

  checkCWCProgression() {
    const cwcMatches = this.world().fixtures.filter(f => f.competition.includes('Club World Cup'));
    
    const checkRound = (currentRound: string, nextRound: string) => {
      const current = cwcMatches.filter(f => f.competition.includes(currentRound));
      if (current.length > 0 && current.every(f => f.played)) {
        const next = cwcMatches.filter(f => f.competition.includes(nextRound));
        if (next.length === 0) {
          this.generateNextCWCRound(current, nextRound);
        }
      }
    };

    checkRound('Quarter Finals', 'Semi Finals');
    checkRound('Semi Finals', 'Final');
  }

  generateNextUCLRound(previousRound: Fixture[], nextRoundName: string) {
    const winners = previousRound.map(f => f.homeScore > f.awayScore ? f.homeClubId : f.awayClubId);
    
    const d = new Date(this.currentDateStr());
    d.setDate(d.getDate() + 14);
    const dateStr = d.toISOString().split('T')[0];
    
    const newFixtures: Fixture[] = [];
    for(let i=0; i<winners.length; i+=2) {
       newFixtures.push({
          id: `ucl_${Math.random()}`,
          homeClubId: winners[i],
          awayClubId: winners[i+1],
          competition: `UEFA Champions League - ${nextRoundName}`,
          date: dateStr,
          played: false,
          homeScore: 0, awayScore: 0, events: [], isKnockout: true
       });
    }
    
    this.world.update(w => ({ ...w, fixtures: [...w.fixtures, ...newFixtures] }));
    this.showNotification(`UEFA Champions League ${nextRoundName} draw has been made!`);
  }

  generateNextCWCRound(previousRound: Fixture[], nextRoundName: string) {
    const winners = previousRound.map(f => f.homeScore > f.awayScore ? f.homeClubId : f.awayClubId);
    
    const d = new Date(this.currentDateStr());
    d.setDate(d.getDate() + 7);
    const dateStr = d.toISOString().split('T')[0];
    
    const newFixtures: Fixture[] = [];
    for(let i=0; i<winners.length; i+=2) {
       newFixtures.push({
          id: `cwc_${Math.random()}`,
          homeClubId: winners[i],
          awayClubId: winners[i+1],
          competition: `Club World Cup - ${nextRoundName}`,
          date: dateStr,
          played: false,
          homeScore: 0, awayScore: 0, events: [], isKnockout: true
       });
    }
    
    this.world.update(w => ({ ...w, fixtures: [...w.fixtures, ...newFixtures] }));
    this.showNotification(`Club World Cup ${nextRoundName} draw has been made!`);
  }

  processMonthlyUpdates() {
    this.world.update(w => {
      let newPlayers = [...w.players];
      const weekNews: string[] = [];
      
      for(let i=0; i<5; i++) {
        const randomPlayerIdx = Math.floor(Math.random() * newPlayers.length);
        const randomClubIdx = Math.floor(Math.random() * w.clubs.length);
        const p = newPlayers[randomPlayerIdx];
        const c = w.clubs[randomClubIdx];
        
        if (p.clubId !== this.currentClubId() && c.id !== this.currentClubId() && p.clubId !== c.id) {
           newPlayers[randomPlayerIdx] = { ...p, clubId: c.id };
           weekNews.push(`BREAKING: ${p.name} transfers to ${c.name} for €${p.value.toLocaleString()}`);
        }
      }

      if (weekNews.length > 0) {
        this.newsFeed.update(n => [...weekNews, ...n].slice(0, 15));
      }

      // Check for expiring contracts
      const currentYear = new Date(this.currentDateStr()).getFullYear();
      const currentMonth = new Date(this.currentDateStr()).getMonth();
      
      const myPlayers = newPlayers.filter(p => p.clubId === this.currentClubId() && p.id !== this.myPlayerId());
      
      if (currentMonth === 5) { // June, contracts expire at end of June
        myPlayers.forEach(p => {
          const endYear = parseInt(p.contractEndDate.split('-')[0]);
          if (endYear === currentYear) {
            this.showNotification(`Contract Expiring: ${p.name}'s contract expires this month!`);
          }
        });
        
        // Actually expire contracts for all clubs
        newPlayers = newPlayers.map(p => {
          const endYear = parseInt(p.contractEndDate.split('-')[0]);
          if (endYear === currentYear) {
             if (p.clubId !== this.currentClubId()) {
               // AI renews if ovr > 70
               if (p.ovr > 70) {
                  return { ...p, contractEndDate: `${currentYear + 2}-06-30` };
               } else {
                  // Free agent or random club
                  const otherClubs = w.clubs.filter(c => c.id !== p.clubId);
                  const randomClub = otherClubs[Math.floor(Math.random() * otherClubs.length)];
                  return { ...p, clubId: randomClub.id, contractEndDate: `${currentYear + 1}-06-30` };
               }
             } else if (p.id !== this.myPlayerId()) {
               // User's player expired and wasn't renewed, they leave the club
               const otherClubs = w.clubs.filter(c => c.id !== p.clubId);
               const randomClub = otherClubs[Math.floor(Math.random() * otherClubs.length)];
               this.showNotification(`${p.name} has left the club as a free agent!`);
               return { ...p, clubId: randomClub.id, contractEndDate: `${currentYear + 2}-06-30` };
             }
          }
          return p;
        });
      } else if (currentMonth === 0) { // January warning
        myPlayers.forEach(p => {
          const endYear = parseInt(p.contractEndDate.split('-')[0]);
          if (endYear === currentYear) {
             this.showNotification(`Contract Warning: ${p.name}'s contract expires in 6 months.`);
          }
        });
      }

      newPlayers = newPlayers.map(p => {
        let newOvr = p.ovr;
        let newValue = p.value;
        
        if (p.age < 24 && Math.random() > 0.7 && p.ovr < 90) {
          newOvr += 1;
          newValue = Math.floor(newValue * 1.1);
        } else if (p.age > 31 && Math.random() > 0.8 && p.ovr > 50) {
          newOvr -= 1;
          newValue = Math.floor(newValue * 0.9);
        }

        return {
          ...p,
          ovr: newOvr,
          value: newValue,
          fitness: Math.max(50, Math.min(100, p.fitness + (Math.floor(Math.random() * 15) - 10))),
          morale: Math.random() > 0.9 ? ['Excellent', 'Good', 'Okay', 'Poor'][Math.floor(Math.random() * 4)] : p.morale
        };
      });

      return { ...w, players: newPlayers };
    });
  }

  trainPlayer() {
    if (this.gameMode() !== 'player') return;
    
    this.world.update(w => {
      const newPlayers = w.players.map(p => {
        if (p.id === this.myPlayerId()) {
          return {
            ...p,
            ovr: Math.min(99, p.ovr + 1),
            pace: Math.min(99, p.pace + Math.floor(Math.random() * 2)),
            shooting: Math.min(99, p.shooting + Math.floor(Math.random() * 2)),
            passing: Math.min(99, p.passing + Math.floor(Math.random() * 2)),
            dribbling: Math.min(99, p.dribbling + Math.floor(Math.random() * 2)),
            physical: Math.min(99, p.physical + Math.floor(Math.random() * 2)),
            value: p.value + 1500000
          };
        }
        return p;
      });
      return { ...w, players: newPlayers };
    });
    this.showNotification('Training complete! Attributes improved.');
  }

  openContractNegotiation(player: Player) {
    this.manageContractPlayer.set(player);
    this.contractOfferWage.set(player.wage);
    this.contractOfferYears.set(1);
    this.contractOfferReleaseClause.set(player.releaseClause);
  }

  closeContractNegotiation() {
    this.manageContractPlayer.set(null);
  }

  proposeContract() {
    const player = this.manageContractPlayer();
    if (!player) return;

    // Simple negotiation logic
    const wageIncrease = this.contractOfferWage() / player.wage;
    let accepted = false;

    if (wageIncrease >= 1.2) {
      accepted = true;
    } else if (wageIncrease >= 1.0 && player.morale === 'Excellent') {
      accepted = true;
    } else if (Math.random() < 0.3) {
      accepted = true;
    }

    if (accepted) {
      this.world.update(w => {
        const newPlayers = w.players.map(p => {
          if (p.id === player.id) {
            const currentYear = new Date(this.currentDateStr()).getFullYear();
            return {
              ...p,
              wage: this.contractOfferWage(),
              contractEndDate: `${currentYear + this.contractOfferYears()}-06-30`,
              releaseClause: this.contractOfferReleaseClause(),
              morale: 'Excellent'
            };
          }
          return p;
        });
        return { ...w, players: newPlayers };
      });
      this.showNotification(`${player.name} has accepted the new contract!`);
      this.closeContractNegotiation();
    } else {
      this.showNotification(`${player.name} rejected the contract offer. They want better terms.`);
      this.world.update(w => {
        const newPlayers = w.players.map(p => {
          if (p.id === player.id) {
            return { ...p, morale: 'Poor' };
          }
          return p;
        });
        return { ...w, players: newPlayers };
      });
    }
  }

  sellPlayer(player: Player) {
    this.world.update(w => {
      const newPlayers = w.players.map(p => {
        if (p.id === player.id) {
          // Move to a random other club
          const otherClubs = w.clubs.filter(c => c.id !== this.currentClubId());
          const randomClub = otherClubs[Math.floor(Math.random() * otherClubs.length)];
          return { ...p, clubId: randomClub.id };
        }
        return p;
      });
      const newClubs = w.clubs.map(c => {
        if (c.id === this.currentClubId()) {
          return { ...c, budget: c.budget + player.value };
        }
        return c;
      });
      return { ...w, players: newPlayers, clubs: newClubs };
    });
    this.showNotification(`${player.name} has been sold for €${player.value.toLocaleString()}.`);
    this.closeContractNegotiation();
  }

  buyClub(club: Club) {
    if (this.gameMode() === 'manager') {
      const myClub = this.currentClub();
      if (!myClub) return;

      const price = club.ovr * 10000000;
      if (myClub.budget >= price) {
        this.world.update(w => {
          const newClubs = w.clubs.map(c => c.id === myClub.id ? { ...c, budget: c.budget - price } : c);
          return { ...w, clubs: newClubs };
        });
        this.showNotification(`Successfully purchased ${club.name}!`);
        this.currentClubId.set(club.id);
        this.setTab('dashboard');
      } else {
        this.showNotification(`Insufficient funds to purchase ${club.name}.`);
      }
    } else if (this.gameMode() === 'player') {
      const player = this.myPlayer();
      const price = club.ovr * 10000000;
      
      if (player && (player.bankBalance || 0) >= price) {
        this.world.update(w => {
          const newPlayers = w.players.map(p => {
            if (p.id === player.id) {
              return { 
                ...p, 
                bankBalance: (p.bankBalance || 0) - price,
                ownedClubs: [...(p.ownedClubs || []), club.name]
              };
            }
            return p;
          });
          return { ...w, players: newPlayers };
        });
        this.showNotification(`Successfully purchased ${club.name} as an owner!`);
      } else {
        this.showNotification(`Insufficient personal funds to purchase ${club.name}.`);
      }
    }
  }

  buyLifestyleItem(type: 'house' | 'car' | 'airplane' | 'bus' | 'yacht', item: { id: string, name: string, price: number, icon: string, desc: string }) {
    const player = this.myPlayer();
    if (!player || (player.bankBalance || 0) < item.price) {
      this.showNotification(`Not enough funds for ${item.name}.`);
      return;
    }

    this.world.update(w => {
      const newPlayers = w.players.map(p => {
        if (p.id === player.id) {
          const updated = { ...p, bankBalance: (p.bankBalance || 0) - item.price };
          if (type === 'house') updated.houses = [...(p.houses || []), item.name];
          if (type === 'car') updated.cars = [...(p.cars || []), item.name];
          if (type === 'airplane') updated.airplanes = [...(p.airplanes || []), item.name];
          if (type === 'bus') updated.buses = [...(p.buses || []), item.name];
          if (type === 'yacht') updated.yachts = [...(p.yachts || []), item.name];
          return updated;
        }
        return p;
      });
      return { ...w, players: newPlayers };
    });
    this.showNotification(`Successfully purchased ${item.name}!`);
  }

  restartCareer() {
    this.gameMode.set('setup');
    this.activeTab.set('dashboard');
    this.myPlayerId.set('');
    this.currentClubId.set(this.world().clubs[0].id);
    this.currentDateStr.set('2025-08-09');
    this.world.set(generateWorld()); // Regenerate world for a fresh start
    this.showNotification('Career restarted.');
  }

  buyPlayer(player: Player) {
    const myClub = this.currentClub();
    if (!myClub || this.gameMode() !== 'manager') return;
    
    if (myClub.budget >= player.value) {
      this.world.update(w => {
        const newClubs = w.clubs.map(c => c.id === myClub.id ? { ...c, budget: c.budget - player.value } : c);
        const newPlayers = w.players.map(p => p.id === player.id ? { ...p, clubId: myClub.id } : p);
        return { ...w, clubs: newClubs, players: newPlayers };
      });
      this.showNotification(`Signed ${player.name} for €${player.value.toLocaleString()}!`);
    } else {
      this.showNotification(`Not enough funds for ${player.name}.`);
    }
  }

  toggleFullscreen() {
    if (isPlatformBrowser(this.platformId)) {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
          this.isFullscreen.set(true);
        }).catch(err => console.error(err));
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().then(() => this.isFullscreen.set(false));
        }
      }
    }
  }

  showNotification(msg: string) {
    this.notification.set(msg);
    setTimeout(() => this.notification.set(null), 4000);
  }
}
