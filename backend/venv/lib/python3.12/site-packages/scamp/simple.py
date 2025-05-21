#  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  #
#  This file is part of SCAMP (Suite for Computer-Assisted Music in Python)                      #
#  Copyright © 2020 Marc Evanstein <marc@marcevanstein.com>.                                     #
#                                                                                                #
#  This program is free software: you can redistribute it and/or modify it under the terms of    #
#  the GNU General Public License as published by the Free Software Foundation, either version   #
#  3 of the License, or (at your option) any later version.                                      #
#                                                                                                #
#  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;     #
#  without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.     #
#  See the GNU General Public License for more details.                                          #
#                                                                                                #
#  You should have received a copy of the GNU General Public License along with this program.    #
#  If not, see <http://www.gnu.org/licenses/>.                                                   #
#  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  #

from scamp.session import Session as _Session

_s = _Session()

_current_instrument = _s.new_part("piano")

_instruments_loaded = {"piano": _current_instrument}


def preload_instruments(*instruments: str):
    for instrument in instruments:
        if instrument not in _instruments_loaded:
            _instruments_loaded[instrument] = _s.new_part(instrument)


def change_instrument(instrument: str):
    global _current_instrument
    instrument = instrument.lower()
    if instrument in _instruments_loaded:
        _current_instrument = _instruments_loaded[instrument]
    else:
        _current_instrument = _s.new_part(instrument)
        _instruments_loaded[instrument] = _current_instrument


_pitch_class_displacements = {
    'c': 0,
    'd': 2,
    'e': 4,
    'f': 5,
    'g': 7,
    'a': 9,
    'b': 11
}

_accidental_displacements = {
    '#': 1,
    's': 1,
    'f': -1,
    'b': -1,
    'x': 2,
    'bb': -2
}


def _pitch_name_to_number(note_name: str):
    note_name = note_name.lower().replace(' ', '')
    pitch_class_name = note_name[0]
    octave = note_name[-1]
    accidental = note_name[1:-1]
    return (int(octave) + 1) * 12 + \
           _pitch_class_displacements[pitch_class_name] + \
           (_accidental_displacements[accidental] if accidental in _accidental_displacements else 0)


def play_note(pitch, volume, duration, blocking=True, properties=None, **kwargs):
    if isinstance(pitch, str):
        pitch = _pitch_name_to_number(pitch)
    _current_instrument.play_note(pitch, volume, duration, blocking=blocking, properties=properties, **kwargs)
