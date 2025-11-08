export type Sentence = {
  id: string;
  text: string;
  tokens: string[];
  spans: {
    complete_subject: number[];
    simple_subject: number[];
    complete_predicate: number[];
    simple_predicate: number[];
  };
  tags: string[];
  level: 1|2|3;
}

export const BANK: Sentence[] = [
  {
    id: 's001',
    text: 'The energetic golden retriever behind the fence barked loudly.',
    tokens: ['The','energetic','golden','retriever','behind','the','fence','barked','loudly','.'],
    spans: { complete_subject:[0,1,2,3,4,5,6], simple_subject:[3], complete_predicate:[7,8,9], simple_predicate:[7] },
    tags: ['prep_phrase_in_subject','single_clause','past_simple'],
    level: 1
  },
  {
    id: 's002',
    text: 'Those two students in the back row finished their science project early.',
    tokens: ['Those','two','students','in','the','back','row','finished','their','science','project','early','.'],
    spans: { complete_subject:[0,1,2,3,4,5,6], simple_subject:[2], complete_predicate:[7,8,9,10,11,12], simple_predicate:[7] },
    tags: ['prep_phrase_in_subject','object_np_in_predicate'],
    level: 1
  },
  {
    id: 's003',
    text: 'My sister and I from New York are visiting our cousins this weekend.',
    tokens: ['My','sister','and','I','from','New','York','are','visiting','our','cousins','this','weekend','.'],
    spans: { complete_subject:[0,1,2,3,4,5,6], simple_subject:[1,3], complete_predicate:[7,8,9,10,11,12,13], simple_predicate:[7,8] },
    tags: ['compound_subject','prep_phrase_in_subject','progressive_as_predicate'],
    level: 2
  },
  {
    id: 's004',
    text: 'The trophies were polished by the coach after practice.',
    tokens: ['The','trophies','were','polished','by','the','coach','after','practice','.'],
    spans: { complete_subject:[0,1], simple_subject:[1], complete_predicate:[2,3,4,5,6,7,8,9], simple_predicate:[2,3] },
    tags: ['passive_voice','two_prep_phrases_in_predicate'],
    level: 2
  },
  {
    id: 's005',
    text: 'After the storm, the narrow bridge over the creek remained closed.',
    tokens: ['After','the','storm',',','the','narrow','bridge','over','the','creek','remained','closed','.'],
    spans: { complete_subject:[4,5,6,7,8,9], simple_subject:[6], complete_predicate:[10,11,12], simple_predicate:[10] },
    tags: ['intro_prep_phrase','prep_phrase_in_subject'],
    level: 2
  },
  {
    id: 's006',
    text: 'The boy who won the spelling bee smiled proudly.',
    tokens: ['The','boy','who','won','the','spelling','bee','smiled','proudly','.'],
    spans: { complete_subject:[0,1,2,3,4,5,6], simple_subject:[1], complete_predicate:[7,8,9], simple_predicate:[7] },
    tags: ['relative_clause_in_subject'],
    level: 2
  },
  {
    id: 's007',
    text: 'There are several reasons for the delay.',
    tokens: ['There','are','several','reasons','for','the','delay','.'],
    spans: { complete_subject:[2,3], simple_subject:[3], complete_predicate:[1,4,5,6,7], simple_predicate:[1] },
    tags: ['expletive_there','prep_phrase_in_predicate'],
    level: 2
  },
  {
    id: 's008',
    text: 'The cat stretched and yawned on the windowsill.',
    tokens: ['The','cat','stretched','and','yawned','on','the','windowsill','.'],
    spans: { complete_subject:[0,1], simple_subject:[1], complete_predicate:[2,3,4,5,6,7,8], simple_predicate:[2,3,4] },
    tags: ['compound_predicate','prep_phrase_in_predicate'],
    level: 1
  },
  {
    id: 's009',
    text: 'The hardworking farmers in the valley harvested the corn yesterday.',
    tokens: ['The','hardworking','farmers','in','the','valley','harvested','the','corn','yesterday','.'],
    spans: { complete_subject:[0,1,2,3,4,5], simple_subject:[2], complete_predicate:[6,7,8,9,10], simple_predicate:[6] },
    tags: ['prep_phrase_in_subject','time_adverb_in_predicate'],
    level: 1
  },
  {
    id: 's010',
    text: 'Our debate team, tired but determined, secured a narrow victory.',
    tokens: ['Our','debate','team',',','tired','but','determined',',','secured','a','narrow','victory','.'],
    spans: { complete_subject:[0,1,2,3,4,5,6,7], simple_subject:[2], complete_predicate:[8,9,10,11,12], simple_predicate:[8] },
    tags: ['appositive_like_modifier','adjective_phrase_in_subject'],
    level: 3
  },
  {
    id: 's011',
    text: 'Swimming in the cold lake builds endurance.',
    tokens: ['Swimming','in','the','cold','lake','builds','endurance','.'],
    spans: { complete_subject:[0,1,2,3,4], simple_subject:[0], complete_predicate:[5,6,7], simple_predicate:[5] },
    tags: ['gerund_subject','prep_phrase_attached_to_subject'],
    level: 3
  },
  {
    id: 's012',
    text: 'The librarian with the kind smile helped us find the atlas today.',
    tokens: ['The','librarian','with','the','kind','smile','helped','us','find','the','atlas','today','.'],
    spans: { complete_subject:[0,1,2,3,4,5], simple_subject:[1], complete_predicate:[6,7,8,9,10,11,12], simple_predicate:[6,8] },
    tags: ['object_pronoun','verb_chain','time_adverb_in_predicate'],
    level: 2
  },
  {
    id: 's013',
    text: 'Every student in the classroom raised their hand.',
    tokens: ['Every','student','in','the','classroom','raised','their','hand','.'],
    spans: { complete_subject:[0,1,2,3,4], simple_subject:[1], complete_predicate:[5,6,7,8], simple_predicate:[5] },
    tags: ['prep_phrase_in_subject','object_np_in_predicate'],
    level: 1
  },
  {
    id: 's014',
    text: 'The fluffy white clouds drifted across the blue sky.',
    tokens: ['The','fluffy','white','clouds','drifted','across','the','blue','sky','.'],
    spans: { complete_subject:[0,1,2,3], simple_subject:[3], complete_predicate:[4,5,6,7,8,9], simple_predicate:[4] },
    tags: ['multiple_adjectives','prep_phrase_in_predicate'],
    level: 1
  },
  {
    id: 's015',
    text: 'My younger brother and his friend built a treehouse yesterday.',
    tokens: ['My','younger','brother','and','his','friend','built','a','treehouse','yesterday','.'],
    spans: { complete_subject:[0,1,2,3,4,5], simple_subject:[2,5], complete_predicate:[6,7,8,9,10], simple_predicate:[6] },
    tags: ['compound_subject','time_adverb_in_predicate'],
    level: 2
  },
  {
    id: 's016',
    text: 'The old wooden bridge near the park was rebuilt last summer.',
    tokens: ['The','old','wooden','bridge','near','the','park','was','rebuilt','last','summer','.'],
    spans: { complete_subject:[0,1,2,3,4,5,6], simple_subject:[3], complete_predicate:[7,8,9,10,11], simple_predicate:[7,8] },
    tags: ['passive_voice','prep_phrase_in_subject','time_phrase_in_predicate'],
    level: 2
  },
  {
    id: 's017',
    text: 'Running quickly down the street seemed dangerous.',
    tokens: ['Running','quickly','down','the','street','seemed','dangerous','.'],
    spans: { complete_subject:[0,1,2,3,4], simple_subject:[0], complete_predicate:[5,6,7], simple_predicate:[5] },
    tags: ['gerund_subject','adverb_in_subject','predicate_adjective'],
    level: 3
  },
  {
    id: 's018',
    text: 'The package from my grandmother arrived this morning.',
    tokens: ['The','package','from','my','grandmother','arrived','this','morning','.'],
    spans: { complete_subject:[0,1,2,3,4], simple_subject:[1], complete_predicate:[5,6,7,8], simple_predicate:[5] },
    tags: ['prep_phrase_in_subject','time_phrase_in_predicate'],
    level: 1
  },
  {
    id: 's019',
    text: 'All the colorful leaves on the ground were swept away.',
    tokens: ['All','the','colorful','leaves','on','the','ground','were','swept','away','.'],
    spans: { complete_subject:[0,1,2,3,4,5,6], simple_subject:[3], complete_predicate:[7,8,9,10], simple_predicate:[7,8] },
    tags: ['passive_voice','prep_phrase_in_subject','phrasal_verb'],
    level: 2
  },
  {
    id: 's020',
    text: 'The team captain and the coach discussed the game plan carefully.',
    tokens: ['The','team','captain','and','the','coach','discussed','the','game','plan','carefully','.'],
    spans: { complete_subject:[0,1,2,3,4,5], simple_subject:[2,5], complete_predicate:[6,7,8,9,10,11], simple_predicate:[6] },
    tags: ['compound_subject','adverb_in_predicate'],
    level: 2
  },
  {
    id: 's021',
    text: 'It is important to arrive on time.',
    tokens: ['It','is','important','to','arrive','on','time','.'],
    spans: { complete_subject:[3,4,5,6], simple_subject:[4], complete_predicate:[1,2,7], simple_predicate:[1] },
    tags: ['expletive_it','infinitive_subject','predicate_adjective'],
    level: 3
  },
  {
    id: 's022',
    text: 'The tall trees along the river provide shade during summer.',
    tokens: ['The','tall','trees','along','the','river','provide','shade','during','summer','.'],
    spans: { complete_subject:[0,1,2,3,4,5], simple_subject:[2], complete_predicate:[6,7,8,9,10], simple_predicate:[6] },
    tags: ['prep_phrase_in_subject','prep_phrase_in_predicate'],
    level: 1
  },
  {
    id: 's023',
    text: 'Neither my friend nor I understood the math problem.',
    tokens: ['Neither','my','friend','nor','I','understood','the','math','problem','.'],
    spans: { complete_subject:[0,1,2,3,4], simple_subject:[2,4], complete_predicate:[5,6,7,8,9], simple_predicate:[5] },
    tags: ['correlative_conjunction','compound_subject'],
    level: 3
  },
  {
    id: 's024',
    text: 'The red bicycle in the garage belongs to my sister.',
    tokens: ['The','red','bicycle','in','the','garage','belongs','to','my','sister','.'],
    spans: { complete_subject:[0,1,2,3,4,5], simple_subject:[2], complete_predicate:[6,7,8,9,10], simple_predicate:[6] },
    tags: ['prep_phrase_in_subject','prep_phrase_in_predicate'],
    level: 1
  },
  {
    id: 's025',
    text: 'The children at the playground laughed and played happily.',
    tokens: ['The','children','at','the','playground','laughed','and','played','happily','.'],
    spans: { complete_subject:[0,1,2,3,4], simple_subject:[1], complete_predicate:[5,6,7,8,9], simple_predicate:[5,7] },
    tags: ['compound_predicate','prep_phrase_in_subject','adverb_in_predicate'],
    level: 2
  }
]
