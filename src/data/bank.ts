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
  }
]
