# Recruiting exercise

## Tasks

- list candidates
- configurable table columns
- edit rejection reasons

Using any preferred stack. And designing the UX and basic look and feel.

### Bonus

I came up with:

- search filters (with debounce)
- pagination

Plus the usual status indications:

- loading message
- no results message
- error message

## Technologies

Mainly:

- React
- Node w/express
- Typescript in both sides
- tRPC

Tested with:

- Jest
- React testing library
- msw (mock server)

Utils:

- React Query

## Demo

### Filters

- Debounced search field (only filters by name for now)
- Checkbox to display only approved candidates
- There's a message indicating that there's no results.

### Paginated list

- Toggle pages
- Arrows disable on first and last page.

### Edit Candidate status

- Edit button in rejection reasons columns
- Modal box to select or deselect rejection reasons
- The list updates when the modal closes

### Config table columns

There's no UI for this, but you can configure the columns you want to display.

### Error screen

- There's a loading message during retries
- Display an error message if server fails.
