/** Reservation for Lunchly */

const moment = require('moment');

const db = require('../db');

/** A reservation for a party */

class Reservation {
  constructor({ id, customerId, numGuests, startAt, notes }) {
    this.id = id;
    this.customerId = customerId;
    this.numGuests = numGuests;
    this.startAt = startAt;
    this.notes = notes;
  }

  /** methods for setting/getting startAt time */

  set startAt(val) {
    if (val instanceof Date && !isNaN(val)) this._startAt = val;
    else throw new Error('Not a valid startAt.');
  }

  get startAt() {
    return this._startAt;
  }

  get formattedStartAt() {
    return moment(this.startAt).format('MMMM Do YYYY, h:mm a');
  }

  /** methods for setting/getting notes (keep as a blank string, not NULL) */

  set notes(val) {
    this._notes = val || '';
  }

  get notes() {
    return this._notes;
  }

  /** methods for setting/getting customer ID: can only set once. */

  set customerId(val) {
    if (this._customerId && this._customerId !== val)
      throw new Error('Cannot change customer ID');
    this._customerId = val;
  }

  get customerId() {
    return this._customerId;
  }

  /** methods for setting/getting numGuests */

  set numGuests(guests) {
    if (guests < 1 || typeof guests !== 'number') {
      throw new Error('Sorry, this is not a valid number of guests');
    } else {
      this._numGuests = guests;
      return guests;
    }
  }

  get numGuests() {
    return this._numGuests;
  }

  /** given a customer id, find their reservations. */

  static async getReservationsForCustomer(customerId) {
    const results = await db.query(
      `SELECT id, 
           customer_id AS "customerId", 
           num_guests AS "numGuests", 
           start_at AS "startAt", 
           notes AS "notes"
         FROM reservations 
         WHERE customer_id = $1`,
      [customerId]
    );

    return results.rows.map(row => new Reservation(row));
  }
  async save() {
    const results = await db.query(
      `INSERT INTO reservations (customer_id, num_guests, start_at, notes)
      VALUES  ($1, $2, $3, $4)
      RETURNING *`,
      [this.customerId, this.numGuests, this.startAt, this.notes]
    );
    // return results.rows[0].id
    console.log(results);
    // } else {
    //   const results =
    return results.rows[0].id;
  }
}

module.exports = Reservation;
