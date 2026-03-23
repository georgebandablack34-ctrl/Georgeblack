export interface League {
  id: string;
  name: string;
  country: string;
  logo: string;
}

export interface Club {
  id: string;
  leagueId: string;
  name: string;
  logo: string;
  budget: number;
  ovr: number;
  played: number;
  points: number;
  gd: number;
}

export interface Player {
  id: string;
  clubId: string;
  name: string;
  position: string;
  ovr: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  value: number;
  wage: number;
  morale: string;
  fitness: number;
  age: number;
  contractEndDate: string;
  releaseClause: number;
  renewalOption: boolean;
  bankBalance?: number;
  houses?: string[];
  cars?: string[];
  airplanes?: string[];
  buses?: string[];
  yachts?: string[];
  ownedClubs?: string[];
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card';
  player: string;
  club: string;
}

export interface Fixture {
  id: string;
  homeClubId: string;
  awayClubId: string;
  competition: string;
  date: string; // YYYY-MM-DD
  played: boolean;
  homeScore: number;
  awayScore: number;
  events: MatchEvent[];
  isKnockout?: boolean;
}

const REAL_CLUBS = [
  { league: 'Premier League', country: 'England', clubs: [
    { name: 'Arsenal', logo: 'https://crests.football-data.org/57.png', ovr: 85 },
    { name: 'Aston Villa', logo: 'https://crests.football-data.org/58.png', ovr: 81 },
    { name: 'Chelsea', logo: 'https://crests.football-data.org/61.png', ovr: 83 },
    { name: 'Liverpool', logo: 'https://crests.football-data.org/64.png', ovr: 86 },
    { name: 'Manchester City', logo: 'https://crests.football-data.org/65.png', ovr: 88 },
    { name: 'Manchester United', logo: 'https://crests.football-data.org/66.png', ovr: 82 },
    { name: 'Newcastle United', logo: 'https://crests.football-data.org/67.png', ovr: 82 },
    { name: 'Tottenham Hotspur', logo: 'https://crests.football-data.org/73.png', ovr: 83 }
  ]},
  { league: 'La Liga', country: 'Spain', clubs: [
    { name: 'Athletic Club', logo: 'https://crests.football-data.org/77.png', ovr: 81 },
    { name: 'Atlético Madrid', logo: 'https://crests.football-data.org/78.png', ovr: 84 },
    { name: 'FC Barcelona', logo: 'https://crests.football-data.org/81.png', ovr: 85 },
    { name: 'Real Madrid', logo: 'https://crests.football-data.org/86.png', ovr: 88 },
    { name: 'Sevilla FC', logo: 'https://crests.football-data.org/559.png', ovr: 80 },
    { name: 'Valencia CF', logo: 'https://crests.football-data.org/95.png', ovr: 78 }
  ]},
  { league: 'Serie A', country: 'Italy', clubs: [
    { name: 'AC Milan', logo: 'https://crests.football-data.org/98.png', ovr: 84 },
    { name: 'Inter Milan', logo: 'https://crests.football-data.org/108.png', ovr: 86 },
    { name: 'Juventus', logo: 'https://crests.football-data.org/109.png', ovr: 84 },
    { name: 'SSC Napoli', logo: 'https://crests.football-data.org/113.png', ovr: 83 },
    { name: 'AS Roma', logo: 'https://crests.football-data.org/100.png', ovr: 81 }
  ]},
  { league: 'Bundesliga', country: 'Germany', clubs: [
    { name: 'Bayern Munich', logo: 'https://crests.football-data.org/5.png', ovr: 87 },
    { name: 'Borussia Dortmund', logo: 'https://crests.football-data.org/4.png', ovr: 83 },
    { name: 'Bayer Leverkusen', logo: 'https://crests.football-data.org/3.png', ovr: 84 },
    { name: 'RB Leipzig', logo: 'https://crests.football-data.org/721.png', ovr: 82 }
  ]},
  { league: 'Ligue 1', country: 'France', clubs: [
    { name: 'Paris Saint-Germain', logo: 'https://crests.football-data.org/524.png', ovr: 86 },
    { name: 'Olympique Marseille', logo: 'https://crests.football-data.org/516.png', ovr: 80 },
    { name: 'Olympique Lyonnais', logo: 'https://crests.football-data.org/523.png', ovr: 79 },
    { name: 'AS Monaco', logo: 'https://crests.football-data.org/548.png', ovr: 80 }
  ]},
  { league: 'MLS', country: 'USA', clubs: [
    { name: 'Inter Miami CF', logo: 'https://crests.football-data.org/11111.png', ovr: 78 },
    { name: 'LA Galaxy', logo: 'https://crests.football-data.org/11112.png', ovr: 75 },
    { name: 'Los Angeles FC', logo: 'https://crests.football-data.org/11113.png', ovr: 76 },
    { name: 'Seattle Sounders', logo: 'https://crests.football-data.org/11114.png', ovr: 74 }
  ]},
  { league: 'Saudi Pro League', country: 'Saudi Arabia', clubs: [
    { name: 'Al Nassr', logo: 'https://crests.football-data.org/11115.png', ovr: 80 },
    { name: 'Al Hilal', logo: 'https://crests.football-data.org/11116.png', ovr: 81 },
    { name: 'Al Ittihad', logo: 'https://crests.football-data.org/11117.png', ovr: 79 },
    { name: 'Al Ahli', logo: 'https://crests.football-data.org/11118.png', ovr: 78 }
  ]},
  { league: 'Eredivisie', country: 'Netherlands', clubs: [
    { name: 'Ajax', logo: 'https://crests.football-data.org/674.png', ovr: 79 },
    { name: 'PSV Eindhoven', logo: 'https://crests.football-data.org/675.png', ovr: 81 },
    { name: 'Feyenoord', logo: 'https://crests.football-data.org/676.png', ovr: 80 },
    { name: 'AZ Alkmaar', logo: 'https://crests.football-data.org/682.png', ovr: 77 }
  ]},
  { league: 'Primeira Liga', country: 'Portugal', clubs: [
    { name: 'Benfica', logo: 'https://crests.football-data.org/1903.png', ovr: 81 },
    { name: 'FC Porto', logo: 'https://crests.football-data.org/503.png', ovr: 80 },
    { name: 'Sporting CP', logo: 'https://crests.football-data.org/498.png', ovr: 82 },
    { name: 'SC Braga', logo: 'https://crests.football-data.org/5613.png', ovr: 78 }
  ]},
  { league: 'Brasileirão', country: 'Brazil', clubs: [
    { name: 'Flamengo', logo: 'https://crests.football-data.org/1765.png', ovr: 78 },
    { name: 'Palmeiras', logo: 'https://crests.football-data.org/1769.png', ovr: 79 },
    { name: 'São Paulo', logo: 'https://crests.football-data.org/1776.png', ovr: 76 },
    { name: 'Fluminense', logo: 'https://crests.football-data.org/1766.png', ovr: 77 }
  ]}
];

const FIRST_NAMES = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth', 'Kevin', 'Brian', 'George', 'Edward', 'Ronald', 'Timothy', 'Jason', 'Jeffrey', 'Ryan', 'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon', 'Benjamin', 'Samuel', 'Gregory', 'Frank', 'Alexander', 'Raymond', 'Patrick', 'Jack', 'Dennis', 'Jerry', 'Tyler', 'Aaron', 'Jose', 'Adam', 'Henry', 'Nathan', 'Douglas', 'Zachary', 'Peter', 'Kyle', 'Walter', 'Ethan', 'Jeremy', 'Harold', 'Keith', 'Christian', 'Roger', 'Noah', 'Gerald', 'Carl', 'Terry', 'Sean', 'Austin', 'Arthur', 'Lawrence', 'Jesse', 'Dylan', 'Bryan', 'Joe', 'Jordan', 'Billy', 'Bruce', 'Albert', 'Willie', 'Gabriel', 'Logan', 'Alan', 'Juan', 'Wayne', 'Roy', 'Ralph', 'Randy', 'Eugene', 'Vincent', 'Russell', 'Elijah', 'Louis', 'Bobby', 'Philip', 'Johnny'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez'];

function buildRoundRobin(clubs: Club[], competition: string, startDateStr: string): Fixture[] {
  const fixtures: Fixture[] = [];
  let fixtureIdCounter = Math.floor(Math.random() * 1000000);
  const teams = [...clubs];
  if (teams.length % 2 !== 0) teams.push({ id: 'dummy' } as Club);
  
  const numRounds = teams.length - 1;
  const half = teams.length / 2;
  
  const currentDate = new Date(startDateStr);

  for (let round = 0; round < numRounds * 2; round++) {
    const dateStr = currentDate.toISOString().split('T')[0];
    
    for (let i = 0; i < half; i++) {
      const home = round % 2 === 0 ? teams[i] : teams[teams.length - 1 - i];
      const away = round % 2 === 0 ? teams[teams.length - 1 - i] : teams[i];
      
      if (home.id !== 'dummy' && away.id !== 'dummy') {
        fixtures.push({
          id: `f${fixtureIdCounter++}`,
          homeClubId: home.id,
          awayClubId: away.id,
          competition,
          date: dateStr,
          played: false,
          homeScore: 0,
          awayScore: 0,
          events: []
        });
      }
    }
    
    teams.splice(1, 0, teams.pop()!);
    currentDate.setDate(currentDate.getDate() + 7);
  }
  return fixtures;
}

function generateUCLFixtures(clubs: Club[], startDateStr: string): Fixture[] {
  const sortedClubs = [...clubs].sort((a, b) => b.ovr - a.ovr).slice(0, 16);
  const fixtures: Fixture[] = [];
  let fId = 200000;
  
  sortedClubs.sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < 8; i++) {
    fixtures.push({
      id: `ucl_${fId++}`,
      homeClubId: sortedClubs[i].id,
      awayClubId: sortedClubs[15 - i].id,
      competition: 'UEFA Champions League - R16',
      date: startDateStr,
      played: false,
      homeScore: 0,
      awayScore: 0,
      events: [],
      isKnockout: true
    });
  }
  return fixtures;
}

function generateClubWorldCupFixtures(clubs: Club[], startDateStr: string): Fixture[] {
  // Select top clubs from different leagues
  const sortedClubs = [...clubs].sort(() => Math.random() - 0.5).slice(0, 8);
  const fixtures: Fixture[] = [];
  let fId = 300000;
  
  for (let i = 0; i < 4; i++) {
    fixtures.push({
      id: `cwc_${fId++}`,
      homeClubId: sortedClubs[i].id,
      awayClubId: sortedClubs[7 - i].id,
      competition: 'Club World Cup - Quarter Finals',
      date: startDateStr,
      played: false,
      homeScore: 0,
      awayScore: 0,
      events: [],
      isKnockout: true
    });
  }
  return fixtures;
}

export function generateWorld() {
  const leagues: League[] = [];
  const clubs: Club[] = [];
  const players: Player[] = [];

  let leagueIdCounter = 1;
  let clubIdCounter = 1;
  let playerIdCounter = 1;

  REAL_CLUBS.forEach(leagueData => {
    const leagueId = `l${leagueIdCounter++}`;
    leagues.push({
      id: leagueId,
      name: leagueData.league,
      country: leagueData.country,
      logo: `https://ui-avatars.com/api/?name=${leagueData.league.replace(' ', '+')}&background=random`
    });

    leagueData.clubs.forEach(clubData => {
      const clubId = `c${clubIdCounter++}`;
      clubs.push({
        id: clubId,
        leagueId: leagueId,
        name: clubData.name,
        logo: clubData.logo,
        budget: clubData.ovr * 2000000,
        ovr: clubData.ovr,
        played: 0,
        points: 0,
        gd: 0
      });

      const positions = ['GK', 'RB', 'CB', 'CB', 'LB', 'CDM', 'CM', 'CAM', 'RW', 'LW', 'ST', 'ST', 'CM', 'CB', 'GK', 'LB', 'RB', 'RW', 'LW', 'CDM'];
      positions.forEach(pos => {
        const playerOvr = Math.max(50, Math.min(99, clubData.ovr + (Math.floor(Math.random() * 15) - 7)));
        const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        
        players.push({
          id: `p${playerIdCounter++}`,
          clubId: clubId,
          name: `${firstName} ${lastName}`,
          position: pos,
          ovr: playerOvr,
          pace: Math.max(40, Math.min(99, playerOvr + (Math.floor(Math.random() * 20) - 10))),
          shooting: Math.max(40, Math.min(99, playerOvr + (Math.floor(Math.random() * 20) - 10))),
          passing: Math.max(40, Math.min(99, playerOvr + (Math.floor(Math.random() * 20) - 10))),
          dribbling: Math.max(40, Math.min(99, playerOvr + (Math.floor(Math.random() * 20) - 10))),
          defending: Math.max(40, Math.min(99, playerOvr + (Math.floor(Math.random() * 20) - 10))),
          physical: Math.max(40, Math.min(99, playerOvr + (Math.floor(Math.random() * 20) - 10))),
          value: Math.floor(Math.pow(playerOvr - 50, 2.5) * 10000),
          wage: Math.floor(Math.pow(playerOvr - 50, 2) * 100),
          morale: ['Excellent', 'Good', 'Okay', 'Poor'][Math.floor(Math.random() * 4)],
          fitness: 80 + Math.floor(Math.random() * 20),
          age: 17 + Math.floor(Math.random() * 18),
          contractEndDate: `${2026 + Math.floor(Math.random() * 5)}-06-30`,
          releaseClause: Math.floor(Math.pow(playerOvr - 50, 2.5) * 15000),
          renewalOption: Math.random() > 0.5,
          bankBalance: Math.floor(Math.random() * 1000000),
          houses: [],
          cars: [],
          airplanes: [],
          buses: [],
          yachts: [],
          ownedClubs: []
        });
      });
    });
  });

  let allFixtures: Fixture[] = [];
  leagues.forEach(league => {
    const leagueClubs = clubs.filter(c => c.leagueId === league.id);
    const leagueFixtures = buildRoundRobin(leagueClubs, league.name, '2025-08-09');
    allFixtures = [...allFixtures, ...leagueFixtures];
  });

  const uclFixtures = generateUCLFixtures(clubs, '2025-09-17');
  const cwcFixtures = generateClubWorldCupFixtures(clubs, '2025-12-15');
  allFixtures = [...allFixtures, ...uclFixtures, ...cwcFixtures];

  return { leagues, clubs, players, fixtures: allFixtures };
}
