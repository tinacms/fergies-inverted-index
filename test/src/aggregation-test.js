import fii from '../../dist/fergies-inverted-index.esm.js'
import test from 'tape'

const sandbox = 'test/sandbox/'
const indexName = sandbox + 'cars-aggregation-test'

const data = [
  {
    "_id": 0,
    "make": "BMW",
    "colour": "Blue",
    "year": 2011,
    "price": 83988,
    "model": "3-series",
    "drivetrain": "Hybrid"
  },
  {
    "_id": 1,
    "make": "Volvo",
    "colour": "Black",
    "year": 2016,
    "price": 44274,
    "model": "XC90",
    "drivetrain": "Petrol"
  },
  {
    "_id": 2,
    "make": "Volvo",
    "colour": "Silver",
    "year": 2008,
    "price": 33114,
    "model": "XC90",
    "drivetrain": "Hybrid"
  },
  {
    "_id": 3,
    "make": "Volvo",
    "colour": "Silver",
    "year": 2007,
    "price": 47391,
    "model": "XC60",
    "drivetrain": "Hybrid"
  },
  {
    "_id": 4,
    "make": "BMW",
    "colour": "Black",
    "year": 2000,
    "price": 88652,
    "model": "5-series",
    "drivetrain": "Diesel"
  },
  {
    "_id": 5,
    "make": "Tesla",
    "colour": "Red",
    "year": 2014,
    "price": 75397,
    "model": "X",
    "drivetrain": "Electric"
  },
  {
    "_id": 6,
    "make": "Tesla",
    "colour": "Blue",
    "year": 2017,
    "price": 79540,
    "model": "S",
    "drivetrain": "Electric"
  },
  {
    "_id": 7,
    "make": "BMW",
    "colour": "Black",
    "year": 2019,
    "price": 57280,
    "model": "3-series",
    "drivetrain": "Petrol"
  },
  {
    "_id": 8,
    "make": "BMW",
    "colour": "Silver",
    "year": 2015,
    "price": 81177,
    "model": "3-series",
    "drivetrain": "Petrol"
  },
  {
    "_id": 9,
    "make": "Volvo",
    "colour": "White",
    "year": 2004,
    "price": 37512,
    "model": "XC90",
    "drivetrain": "Hybrid"
  }
]

test('create a little world bank index', t => {
  t.plan(1)
  fii({ name: indexName }, (err, idx) => {
    global[indexName] = idx
    t.error(err)
  })
})

test('can add some worldbank data', t => {
  t.plan(1)
  global[indexName].PUT(data).then(t.pass)
})

test('can GET a single bucket', t => {
  t.plan(1)
  global[indexName].BUCKET({
    FIELD: 'make',
    VALUE: 'Volvo'
  }).then(result => {
      t.looseEqual(result, {
        FIELD: 'make',
        VALUE: {
          GTE: 'Volvo',
          LTE: 'Volvo'
        },
        _id: [ '1', '2', '3', '9' ]
      })
    })
})

test('can GET a single bucket with gte LTE', t => {
  t.plan(1)
  global[indexName].BUCKET({
    FIELD: 'make',
    VALUE: {
      GTE: 'Volvo',
      LTE: 'Volvo'
    }
  }).then(result => {
      t.looseEqual(result, {
        FIELD: 'make',
        VALUE: {
          GTE: 'Volvo',
          LTE: 'Volvo'
        },
        _id: [ '1', '2', '3', '9' ]
      })
    })
})

test('can get DISTINCT values', t => {
  t.plan(1)
  global[indexName].DISTINCT({
    FIELD:'make'
  }).then(result => t.looseEquals(result, [
    { FIELD: 'make', VALUE: 'BMW' },
    { FIELD: 'make', VALUE: 'Tesla' },
    { FIELD: 'make', VALUE: 'Volvo' }
  ]))
})

test('can get DISTINCT values with gte', t => {
  t.plan(1)
  global[indexName].DISTINCT({
    FIELD: 'make',
    VALUE: {
      GTE: 'C'
    }
  }).then(result => t.looseEquals(result, [
    { FIELD: 'make', VALUE: 'Tesla' },
    { FIELD: 'make', VALUE: 'Volvo' }
  ]))
})

test('can get DISTINCT VALUEs with GTE and LTE', t => {
  t.plan(1)
  global[indexName].DISTINCT({
    FIELD: 'make',
    VALUE: {
      GTE: 'C',
      LTE: 'U'
    }
  }).then(result => t.looseEquals(result, [
    { FIELD: 'make', VALUE: 'Tesla' }
  ]))
})



// TODO
// Nice error message if field doesnt exist
